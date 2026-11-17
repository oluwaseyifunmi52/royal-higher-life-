import crypto from "crypto";
import { PaymentNotConfiguredError, PaymentProviderError } from "./errors.js";

const DEFAULT_BASE_URL = "https://api.paystack.co";
const REQUEST_TIMEOUT_MS = 25000;

function secretKey() {
    const key = process.env.PAYSTACK_SECRET_KEY?.trim();
    if (!key) throw new PaymentNotConfiguredError("Paystack");
    return key;
}

function baseUrl() {
    return (process.env.PAYSTACK_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, "");
}

async function paystackRequest(path, { method = "GET", body } = {}) {
    let response;
    try {
        response = await fetch(`${baseUrl()}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${secretKey()}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        throw new PaymentProviderError("Could not reach Paystack. Please try again.", {
            provider: "paystack",
            code: "PAYSTACK_UNREACHABLE",
            cause: error,
        });
    }

    let payload = null;
    try {
        payload = await response.json();
    } catch {
        payload = null;
    }

    if (!response.ok || payload?.status === false) {
        const detail =
            typeof payload?.message === "string" && payload.message.trim()
                ? payload.message.trim().slice(0, 240)
                : `Paystack returned HTTP ${response.status}.`;
        throw new PaymentProviderError(`Paystack could not process this payment: ${detail}`, {
            provider: "paystack",
            code: "PAYSTACK_REJECTED",
            statusCode: response.status >= 500 ? 502 : 400,
        });
    }

    return payload;
}

export async function initializeDonation({
    amountMinor,
    currency,
    email,
    reference,
    callbackUrl,
    metadata = {},
}) {
    const payload = await paystackRequest("/transaction/initialize", {
        method: "POST",
        body: {
            email,
            amount: amountMinor,
            currency,
            reference,
            callback_url: callbackUrl,
            metadata,
        },
    });

    const data = payload?.data;
    if (!data?.authorization_url || !data?.reference) {
        throw new PaymentProviderError("Paystack did not return a checkout link.", {
            provider: "paystack",
            code: "PAYSTACK_INVALID_RESPONSE",
        });
    }

    return {
        authorizationUrl: data.authorization_url,
        providerReference: data.reference,
        providerStatus: "initialized",
        accessCode: data.access_code,
    };
}

export async function verifyDonation({ reference }) {
    const payload = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
    const data = payload?.data;
    if (!data) {
        throw new PaymentProviderError("Paystack did not return a transaction status.", {
            provider: "paystack",
            code: "PAYSTACK_INVALID_RESPONSE",
        });
    }

    const providerStatus = String(data.status || "unknown").toLowerCase();
    let status = "pending";
    if (providerStatus === "success") status = "successful";
    else if (["failed", "reversed", "abandoned"].includes(providerStatus)) status = "failed";

    return {
        status,
        providerStatus,
        amountMinor: Number(data.amount),
        currency: String(data.currency || "").toUpperCase(),
        paidAt: data.paid_at ? new Date(data.paid_at) : null,
        gatewayResponse: data.gateway_response || "",
        providerReference: data.reference || reference,
        providerTransactionId: data.id ? String(data.id) : "",
    };
}

export function verifyWebhookSignature(rawBody, signature) {
    if (!signature || !rawBody) return false;
    try {
        const expected = crypto
            .createHmac("sha512", secretKey())
            .update(rawBody)
            .digest("hex");
        const expectedBuffer = Buffer.from(expected, "utf8");
        const providedBuffer = Buffer.from(String(signature).trim(), "utf8");
        return (
            expectedBuffer.length === providedBuffer.length &&
            crypto.timingSafeEqual(expectedBuffer, providedBuffer)
        );
    } catch {
        return false;
    }
}
