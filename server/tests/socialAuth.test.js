import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import User from "../models/User.js";
import OAuthTransaction from "../models/OAuthTransaction.js";
import socialAuthRoutes from "../routes/socialAuth.js";

test("social members do not need invented local password credentials", async () => {
    const user = new User({
        firstName: "Test",
        lastName: "Member",
        email: "test.member@example.com",
        provider: "google",
        providerId: "google-subject-123",
        emailVerified: true,
    });

    await assert.doesNotReject(user.validate());
    assert.equal(user.role, "member");
    assert.equal(user.password, undefined);
});

test("OAuth transaction schema requires expiry and supports one-time state records", async () => {
    const transaction = new OAuthTransaction({
        purpose: "state",
        tokenHash: "a".repeat(64),
        provider: "google",
        nonce: "n".repeat(32),
        expiresAt: new Date(Date.now() + 60_000),
    });

    await assert.doesNotReject(transaction.validate());
});

test("auth social endpoints exist and safely report missing provider configuration", async () => {
    const keys = [
        "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL",
        "FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET", "FACEBOOK_CALLBACK_URL", "FRONTEND_URL",
    ];
    const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
    for (const key of keys) delete process.env[key];

    const app = express();
    app.use(express.json());
    app.use("/api/auth/social", socialAuthRoutes);
    const server = app.listen(0, "127.0.0.1");
    try {
        await new Promise((resolve) => server.once("listening", resolve));
        const address = server.address();
        for (const provider of ["google", "facebook"]) {
            const response = await fetch("http://127.0.0.1:" + address.port + "/api/auth/social/" + provider);
            const body = await response.json();
            assert.equal(response.status, 503);
            assert.match(body.message, /not configured/i);
            assert.equal(JSON.stringify(body).includes("secret"), false);
        }

        const badCode = await fetch("http://127.0.0.1:" + address.port + "/api/auth/social/exchange", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: "invalid" }),
        });
        assert.equal(badCode.status, 400);
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
        for (const key of keys) {
            if (previous[key] === undefined) delete process.env[key];
            else process.env[key] = previous[key];
        }
    }
});

test("OAuth callback rejects invalid state and returns a safe cancellation redirect", async () => {
    const previousFrontend = process.env.FRONTEND_URL;
    const previousFindOneAndDelete = OAuthTransaction.findOneAndDelete;
    let stateResult = null;
    process.env.FRONTEND_URL = "http://localhost:5174";
    OAuthTransaction.findOneAndDelete = (filter) => {
        assert.equal(filter.purpose, "state");
        return { select: async () => stateResult };
    };

    const app = express();
    app.use("/api/auth/social", socialAuthRoutes);
    const server = app.listen(0, "127.0.0.1");
    try {
        await new Promise((resolve) => server.once("listening", resolve));
        const base = "http://127.0.0.1:" + server.address().port + "/api/auth/social/google/callback";

        const invalid = await fetch(base + "?state=invalid", { redirect: "manual" });
        assert.equal(invalid.status, 303);
        assert.match(invalid.headers.get("location"), /social_error=invalid_state/);

        stateResult = { nonce: "verified-test-nonce" };
        const cancelled = await fetch(base + "?state=valid&error=access_denied", { redirect: "manual" });
        assert.equal(cancelled.status, 303);
        assert.match(cancelled.headers.get("location"), /social_error=cancelled/);
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
        OAuthTransaction.findOneAndDelete = previousFindOneAndDelete;
        if (previousFrontend === undefined) delete process.env.FRONTEND_URL;
        else process.env.FRONTEND_URL = previousFrontend;
    }
});
