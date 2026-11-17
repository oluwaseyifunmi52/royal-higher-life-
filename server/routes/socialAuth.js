import crypto from "node:crypto";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OAuthTransaction from "../models/OAuthTransaction.js";

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATE_TTL_MS = 10 * 60 * 1000;
const EXCHANGE_TTL_MS = 60 * 1000;
let googleSigningKeys = { expiresAt: 0, keys: new Map() };

const providerSettings = {
    google: {
        clientId: () => process.env.GOOGLE_CLIENT_ID,
        clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: () => process.env.GOOGLE_CALLBACK_URL,
    },
    facebook: {
        clientId: () => process.env.FACEBOOK_APP_ID,
        clientSecret: () => process.env.FACEBOOK_APP_SECRET,
        callbackUrl: () => process.env.FACEBOOK_CALLBACK_URL,
    },
};

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const randomToken = () => crypto.randomBytes(32).toString("base64url");
const validProvider = (provider) => Object.hasOwn(providerSettings, provider);

function providerFailure(provider, reason) {
    const error = new Error(reason);
    error.socialProvider = provider;
    return error;
}

function configuredSettings(provider) {
    if (!validProvider(provider)) return null;
    const values = providerSettings[provider];
    const configuration = {
        clientId: values.clientId(),
        clientSecret: values.clientSecret(),
        callbackUrl: values.callbackUrl(),
    };
    if (Object.values(configuration).some((value) => typeof value !== "string" || !value.trim())) return null;

    try {
        const callback = new URL(configuration.callbackUrl);
        if (callback.search || callback.hash) return null;
        if (process.env.NODE_ENV === "production" && callback.protocol !== "https:") return null;
    } catch {
        return null;
    }
    return configuration;
}

function redirectFrontend(res, values = {}) {
    let frontend;
    try {
        frontend = new URL(process.env.FRONTEND_URL);
    } catch {
        return res.status(503).json({ success: false, message: "Social sign-in is not configured." });
    }
    if (process.env.NODE_ENV === "production" && frontend.protocol !== "https:") {
        return res.status(503).json({ success: false, message: "Social sign-in is not configured." });
    }

    frontend.pathname = "/login";
    frontend.search = "";
    frontend.hash = new URLSearchParams(values).toString();
    return res.redirect(303, frontend.toString());
}

async function fetchJson(provider, url, options, reason) {
    let response;
    try {
        response = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
    } catch {
        throw providerFailure(provider, reason);
    }
    if (!response.ok) throw providerFailure(provider, reason);
    try {
        return await response.json();
    } catch {
        throw providerFailure(provider, "provider_response_invalid");
    }
}

async function getGoogleIdentity(code, stateRecord, config) {
    const tokenResponse = await fetchJson(
        "google",
        "https://oauth2.googleapis.com/token",
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: config.clientId,
                client_secret: config.clientSecret,
                redirect_uri: config.callbackUrl,
                grant_type: "authorization_code",
            }),
        },
        "provider_error"
    );
    const idToken = tokenResponse.id_token;
    if (typeof idToken !== "string") throw providerFailure("google", "provider_response_invalid");

    const parts = idToken.split(".");
    if (parts.length !== 3) throw providerFailure("google", "provider_identity_unverified");
    let header;
    try {
        header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    } catch {
        throw providerFailure("google", "provider_identity_unverified");
    }
    if (header.alg !== "RS256" || typeof header.kid !== "string") {
        throw providerFailure("google", "provider_identity_unverified");
    }

    let publicKey = googleSigningKeys.keys.get(header.kid);
    if (!publicKey || googleSigningKeys.expiresAt <= Date.now()) {
        const keyResponse = await fetchJson(
            "google",
            "https://www.googleapis.com/oauth2/v3/certs",
            {},
            "provider_error"
        );
        const cacheHeader = keyResponse.headers?.["cache-control"] || "";
        const maxAge = Number(cacheHeader.match(/max-age=(\d+)/i)?.[1] || 3600);
        const keys = new Map();
        for (const key of keyResponse.keys || []) {
            if (key.kty === "RSA" && key.use === "sig" && (!key.alg || key.alg === "RS256") && key.kid) {
                keys.set(key.kid, crypto.createPublicKey({ key, format: "jwk" }));
            }
        }
        googleSigningKeys = { expiresAt: Date.now() + maxAge * 1000, keys };
        publicKey = keys.get(header.kid);
    }
    if (!publicKey) throw providerFailure("google", "provider_identity_unverified");

    let claims;
    try {
        claims = jwt.verify(idToken, publicKey, {
            algorithms: ["RS256"],
            audience: config.clientId,
            issuer: ["accounts.google.com", "https://accounts.google.com"],
            clockTolerance: 60,
        });
    } catch {
        throw providerFailure("google", "provider_identity_unverified");
    }
    if (
        claims.nonce !== stateRecord.nonce ||
        !claims.sub ||
        !(claims.email_verified === true || claims.email_verified === "true") ||
        typeof claims.email !== "string" ||
        !EMAIL_PATTERN.test(claims.email)
    ) {
        throw providerFailure("google", "provider_identity_unverified");
    }

    return {
        id: claims.sub,
        email: claims.email.trim().toLowerCase(),
        firstName: claims.given_name || claims.name?.split(" ")[0] || "Member",
        lastName: claims.family_name || claims.name?.split(" ").slice(1).join(" ") || "Member",
        emailVerified: true,
        profilePicture: typeof claims.picture === "string" && claims.picture.startsWith("https://")
            ? claims.picture
            : undefined,
    };
}

async function getFacebookIdentity(code, config) {
    const tokenUrl = new URL("https://graph.facebook.com/v27.0/oauth/access_token");
    tokenUrl.search = new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.callbackUrl,
    }).toString();
    const tokenResponse = await fetchJson("facebook", tokenUrl, {}, "provider_error");
    const accessToken = tokenResponse.access_token;
    if (typeof accessToken !== "string") throw providerFailure("facebook", "provider_response_invalid");

    const debugUrl = new URL("https://graph.facebook.com/v27.0/debug_token");
    debugUrl.search = new URLSearchParams({
        input_token: accessToken,
        access_token: config.clientId + "|" + config.clientSecret,
    }).toString();
    const debugResponse = await fetchJson("facebook", debugUrl, {}, "provider_error");
    const token = debugResponse.data;
    if (
        !token?.is_valid ||
        token.app_id !== config.clientId ||
        !token.user_id ||
        !Array.isArray(token.scopes) ||
        !token.scopes.includes("email") ||
        (Number(token.expires_at) > 0 && Number(token.expires_at) <= Math.floor(Date.now() / 1000))
    ) {
        throw providerFailure("facebook", "provider_identity_unverified");
    }

    const profileUrl = new URL("https://graph.facebook.com/v27.0/me");
    profileUrl.search = new URLSearchParams({
        fields: "id,name,email,picture.type(large)",
        access_token: accessToken,
    }).toString();
    const profile = await fetchJson("facebook", profileUrl, {}, "provider_error");
    if (
        profile.id !== token.user_id ||
        typeof profile.email !== "string" ||
        !EMAIL_PATTERN.test(profile.email)
    ) {
        throw providerFailure("facebook", "provider_email_unavailable");
    }

    const nameParts = typeof profile.name === "string" ? profile.name.trim().split(/\s+/) : [];
    const picture = profile.picture?.data?.url;
    return {
        id: profile.id,
        email: profile.email.trim().toLowerCase(),
        firstName: nameParts.shift() || "Member",
        lastName: nameParts.join(" ") || "Member",
        emailVerified: false,
        profilePicture: typeof picture === "string" && picture.startsWith("https://") ? picture : undefined,
    };
}

async function findOrCreateSocialUser(provider, identity) {
    const user = await User.findOne({ provider, providerId: identity.id });
    if (user) return user;

    const existingEmail = await User.findOne({ email: identity.email }).select("_id");
    if (existingEmail) throw providerFailure(provider, "account_exists");

    try {
        return await User.create({
            firstName: identity.firstName.slice(0, 100) || "Member",
            lastName: identity.lastName.slice(0, 100) || "Member",
            email: identity.email,
            provider,
            providerId: identity.id,
            emailVerified: identity.emailVerified,
            ...(identity.profilePicture ? { profilePicture: identity.profilePicture } : {}),
        });
    } catch (error) {
        if (error.code === 11000) throw providerFailure(provider, "account_exists");
        throw error;
    }
}

router.get("/:provider", async (req, res) => {
    const { provider } = req.params;
    const config = configuredSettings(provider);
    if (!config || !process.env.FRONTEND_URL) {
        return res.status(503).json({
            success: false,
            message: validProvider(provider)
                ? provider + " sign-in is not configured on the server."
                : "That sign-in provider is not supported.",
        });
    }

    const state = randomToken();
    const nonce = randomToken();
    try {
        await OAuthTransaction.create({
            purpose: "state",
            tokenHash: hash(state),
            provider,
            nonce,
            expiresAt: new Date(Date.now() + STATE_TTL_MS),
        });
    } catch (error) {
        console.error("Social OAuth state could not be stored.", { provider, code: error.code || error.name });
        return res.status(503).json({ success: false, message: "Unable to start sign-in. Please try again." });
    }

    const authorizationUrl = provider === "google"
        ? new URL("https://accounts.google.com/o/oauth2/v2/auth")
        : new URL("https://www.facebook.com/v27.0/dialog/oauth");
    const params = {
        client_id: config.clientId,
        redirect_uri: config.callbackUrl,
        response_type: "code",
        scope: provider === "google" ? "openid email profile" : "email,public_profile",
        state,
    };
    if (provider === "google") {
        params.nonce = nonce;
        params.prompt = "select_account";
    }
    authorizationUrl.search = new URLSearchParams(params).toString();
    return res.json({ success: true, data: { authorizationUrl: authorizationUrl.toString() } });
});

router.get("/:provider/callback", async (req, res) => {
    const { provider } = req.params;
    if (!validProvider(provider)) return redirectFrontend(res, { social_error: "provider_not_supported" });

    const state = typeof req.query.state === "string" ? req.query.state : "";
    if (!state) return redirectFrontend(res, { social_error: "invalid_state" });

    let stateRecord;
    try {
        stateRecord = await OAuthTransaction.findOneAndDelete({
            purpose: "state",
            provider,
            tokenHash: hash(state),
            expiresAt: { $gt: new Date() },
        }).select("+nonce");
    } catch (error) {
        console.error("Social OAuth state validation failed.", { provider, code: error.code || error.name });
        return redirectFrontend(res, { social_error: "temporarily_unavailable" });
    }
    if (!stateRecord) return redirectFrontend(res, { social_error: "invalid_state" });

    if (req.query.error) {
        return redirectFrontend(res, {
            social_error: req.query.error === "access_denied" ? "cancelled" : "provider_denied",
        });
    }
    const code = typeof req.query.code === "string" ? req.query.code : "";
    const config = configuredSettings(provider);
    if (!code || !config) return redirectFrontend(res, { social_error: "invalid_callback" });

    try {
        const identity = provider === "google"
            ? await getGoogleIdentity(code, stateRecord, config)
            : await getFacebookIdentity(code, config);
        const user = await findOrCreateSocialUser(provider, identity);
        if (user.isActive === false) return redirectFrontend(res, { social_error: "account_disabled" });

        const exchangeCode = randomToken();
        await OAuthTransaction.create({
            purpose: "exchange",
            tokenHash: hash(exchangeCode),
            provider,
            userId: user._id,
            expiresAt: new Date(Date.now() + EXCHANGE_TTL_MS),
        });
        return redirectFrontend(res, { social_code: exchangeCode });
    } catch (error) {
        const reason = error.socialProvider ? error.message : "provider_error";
        if (!error.socialProvider) {
            console.error("Social OAuth callback failed.", { provider, code: error.code || error.name });
        }
        return redirectFrontend(res, { social_error: reason });
    }
});

router.post("/exchange", async (req, res) => {
    const exchangeCode = typeof req.body?.code === "string" ? req.body.code : "";
    if (exchangeCode.length < 32 || exchangeCode.length > 128) {
        return res.status(400).json({ success: false, message: "The social sign-in session is invalid or expired." });
    }

    try {
        const grant = await OAuthTransaction.findOneAndDelete({
            purpose: "exchange",
            tokenHash: hash(exchangeCode),
            expiresAt: { $gt: new Date() },
        });
        if (!grant) return res.status(400).json({ success: false, message: "The social sign-in session is invalid or expired." });

        const user = await User.findById(grant.userId).select("-password -otp -otpExpires -resetPasswordToken -resetPasswordExpires -providerId");
        if (!user || user.isActive === false) {
            return res.status(401).json({ success: false, message: "This account cannot sign in." });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(200).json({ success: true, token, user });
    } catch (error) {
        console.error("Social OAuth code exchange failed.", { code: error.code || error.name });
        return res.status(503).json({ success: false, message: "Unable to complete social sign-in. Please try again." });
    }
});

export default router;

