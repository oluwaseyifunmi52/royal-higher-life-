import * as paystack from "./paystack.js";
import * as paypal from "./paypal.js";
import { getProviderIdsForCurrency } from "../../config/donationCurrencies.js";
import { PaymentNotConfiguredError } from "./errors.js";

const ADAPTERS = {
    paystack,
    paypal,
};

export function getAdapter(providerId) {
    const adapter = ADAPTERS[String(providerId || "").toLowerCase()];
    if (!adapter) throw new PaymentNotConfiguredError(providerId || "Payment provider");
    return adapter;
}

/**
 * Returns provider adapters in the order they should be attempted for a
 * currency. Paystack is preferred for African currencies; PayPal covers the
 * international currencies Paystack cannot process.
 */
export function getProvidersForCurrency(currency) {
    return getProviderIdsForCurrency(currency)
        .map((id) => ({ id, adapter: ADAPTERS[id] }))
        .filter((provider) => Boolean(provider.adapter));
}

export async function verifyPaystackWebhook(rawBody, signature) {
    const adapter = getAdapter("paystack");
    return adapter.verifyWebhookSignature(rawBody, signature);
}

export async function verifyPaypalWebhook(headers, rawBody) {
    const adapter = getAdapter("paypal");
    return adapter.verifyWebhookSignature({ headers, rawBody });
}
