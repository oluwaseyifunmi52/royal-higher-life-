import { PaymentNotConfiguredError, PaymentProviderError } from "./errors.js";

const REQUEST_TIMEOUT_MS = 25000;
let tokenCache = { value: null, expiresAt: 0 };

function credentials() {
    const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) throw new PaymentNotConfiguredError("PayPal");
    return { clientId, clientSecret };
}

function baseUrl() {
    const configured = process.env.PAYPAL_BASE_URL?.trim();
    if (configured) return configured.replace(/\/$/, "");
    return process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase() === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
}

async function accessToken() {
    const now = Date.now();
    if (tokenCache.value && tokenCache.expiresAt > now + 60000) return tokenCache.value;

    const { clientId, clientSecret } = credentials();
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    let response;
    try {
        response = await fetch(`${baseUrl()}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: "grant_type=client_credentials",
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        throw new PaymentProviderError("Could not reach PayPal. Please try again.", {
            provider: "paypal",
            code: "PAYPAL_UNREACHABLE",
            cause: error,
        });
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.access_token) {
        throw new PaymentProviderError("PayPal authentication failed.", {
            provider: "paypal",
            code: "PAYPAL_AUTH_FAILED",
            statusCode: 502,
        });
    }

    tokenCache = {
        value: payload.access_token,
        expiresAt: now + Number(payload.expires_in || 300) * 1000,
    };
    return tokenCache.value;
}

async function paypalRequest(path, { method = "GET", body, headers = {} } = {}) {
    const token = await accessToken();
    let response;
    try {
        response = await fetch(`${baseUrl()}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers,
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        throw new PaymentProviderError("Could not reach PayPal. Please try again.", {
            provider: "paypal",
            code: "PAYPAL_UNREACHABLE",
            cause: error,
        });
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        const detail =
            payload?.message ||
            payload?.details?.[0]?.description ||
            `PayPal returned HTTP ${response.status}.`;
        throw new PaymentProviderError(`PayPal could not process this payment: ${String(detail).slice(0, 240)}`, {
            provider: "paypal",
            code: "PAYPAL_REJECTED",
            statusCode: response.status >= 500 ? 502 : 400,
        });
    }

    return payload;
}

function amountValue(amount) {
    return Number(amount).toFixed(2);
}

export async function initializeDonation({
    amount,
    currency,
    reference,
    returnUrl,
    cancelUrl,
    metadata = {},
}) {
    const payload = await paypalRequest("/v2/checkout/orders", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: reference,
                    custom_id: metadata.donationId ? String(metadata.donationId) : reference,
                    description: String(metadata.purpose || "Church donation").slice(0, 120),
                    amount: {
                        currency_code: currency,
                        value: amountValue(amount),
                    },
                },
            ],
            application_context: {
                brand_name: "Royal HigherLife Christian Ministries",
                locale: "en-US",
                shipping_preference: "NO_SHIPPING",
                user_action: "PAY_NOW",
                return_url: returnUrl,
                cancel_url: cancelUrl,
            },
        },
    });

    const approvalLink = payload?.links?.find(
        (link) => link.rel === "approve" || link.rel === "payer-action"
    );
    if (!payload?.id || !approvalLink?.href) {
        throw new PaymentProviderError("PayPal did not return an approval link.", {
            provider: "paypal",
            code: "PAYPAL_INVALID_RESPONSE",
        });
    }

    return {
        authorizationUrl: approvalLink.href,
        providerReference: payload.id,
        providerStatus: String(payload.status || "CREATED").toLowerCase(),
    };
}

function extractCapture(order) {
    const unit = order?.purchase_units?.[0];
    const captures = unit?.payments?.captures;
    const capture = Array.isArray(captures) ? captures[0] : null;
    return { unit, capture };
}

function mapOrderStatus(order, capture) {
    const orderStatus = String(order?.status || "").toUpperCase();
    const captureStatus = String(capture?.status || "").toUpperCase();

    if (orderStatus === "COMPLETED" && (!capture || captureStatus === "COMPLETED")) return "successful";
    if (["VOIDED", "PAYER_ACTION_REQUIRED"].includes(orderStatus)) {
        return orderStatus === "VOIDED" ? "failed" : "pending";
    }
    if (["DECLINED", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"].includes(captureStatus)) return "failed";
    if (captureStatus === "COMPLETED") return "successful";
    return "pending";
}

export async function verifyDonation({ reference }) {
    let order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(reference)}`);

    if (String(order?.status || "").toUpperCase() === "APPROVED") {
        order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(reference)}/capture`, {
            method: "POST",
            body: {},
            headers: { Prefer: "return=representation" },
        });
    }

    const { unit, capture } = extractCapture(order);
    const amount = capture?.amount || unit?.amount || null;
    const status = mapOrderStatus(order, capture);

    return {
        status,
        providerStatus: String(capture?.status || order?.status || "unknown").toLowerCase(),
        amount: amount?.value !== undefined ? Number(amount.value) : null,
        amountMinor: amount?.value !== undefined ? Math.round(Number(amount.value) * 100) : null,
        currency: String(amount?.currency_code || "").toUpperCase(),
        paidAt: capture?.create_time ? new Date(capture.create_time) : null,
        providerReference: order?.id || reference,
        providerTransactionId: capture?.id ? String(capture.id) : "",
    };
}

export async function verifyWebhookSignature({ headers, rawBody }) {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
    if (!webhookId) {
        throw new PaymentNotConfiguredError("PayPal webhook verification");
    }

    const requiredHeaders = [
        "paypal-transmission-id",
        "paypal-transmission-time",
        "paypal-cert-url",
        "paypal-auth-algo",
        "paypal-transmission-sig",
    ];
    if (requiredHeaders.some((name) => !headers?.[name])) return false;

    const payload = await paypalRequest("/v1/notifications/verify-webhook-signature", {
        method: "POST",
        body: {
            auth_algo: headers["paypal-auth-algo"],
            cert_url: headers["paypal-cert-url"],
            transmission_id: headers["paypal-transmission-id"],
            transmission_sig: headers["paypal-transmission-sig"],
            transmission_time: headers["paypal-transmission-time"],
            webhook_id: webhookId,
            webhook_event: JSON.parse(Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody),
        },
    });

    return payload?.verification_status === "SUCCESS";
}

export function parseWebhookEvent(rawBody) {
    try {
        return JSON.parse(Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : rawBody);
    } catch {
        return null;
    }
}
