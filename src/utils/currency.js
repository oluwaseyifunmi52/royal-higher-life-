export const CURRENCY_META = {
    NGN: { code: "NGN", name: "Nigerian Naira", symbol: "₦", decimals: 2, presets: [5000, 10000, 25000, 50000, 100000], minimum: 100, maximum: 10000000 },
    USD: { code: "USD", name: "US Dollar", symbol: "$", decimals: 2, presets: [10, 25, 50, 100, 250], minimum: 2, maximum: 50000 },
    GBP: { code: "GBP", name: "British Pound", symbol: "£", decimals: 2, presets: [5, 10, 25, 50, 100], minimum: 1, maximum: 40000 },
    EUR: { code: "EUR", name: "Euro", symbol: "€", decimals: 2, presets: [5, 10, 25, 50, 100], minimum: 1, maximum: 40000 },
    CAD: { code: "CAD", name: "Canadian Dollar", symbol: "CA$", decimals: 2, presets: [10, 25, 50, 100, 250], minimum: 2, maximum: 60000 },
    AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2, presets: [10, 25, 50, 100, 250], minimum: 2, maximum: 60000 },
    GHS: { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", decimals: 2, presets: [50, 100, 250, 500, 1000], minimum: 1, maximum: 500000 },
    KES: { code: "KES", name: "Kenyan Shilling", symbol: "KSh", decimals: 2, presets: [500, 1000, 2500, 5000, 10000], minimum: 50, maximum: 5000000 },
    ZAR: { code: "ZAR", name: "South African Rand", symbol: "R", decimals: 2, presets: [100, 250, 500, 1000, 2500], minimum: 10, maximum: 500000 },
};

export const CURRENCY_OPTIONS = Object.values(CURRENCY_META);

export function currencyAvailabilityErrorMessage(error) {
    const status = error?.response?.status;
    const apiMessage = error?.response?.data?.message;
    const code = typeof error?.code === "string" ? error.code : "";
    const safeMessage = typeof apiMessage === "string"
        ? apiMessage
              .replace(/(?:Bearer\s+|password[=:]\s*|secret[=:]\s*)\S+/gi, "[redacted]")
              .replace(/mongodb(?:\+srv)?:\/\/\S+/gi, "[redacted database URI]")
              .replace(/\bsk_(?:test|live)_\S+/gi, "[redacted payment key]")
              .slice(0, 180)
        : "";
    if (status) return `Currency availability check failed (HTTP ${status})${safeMessage ? `: ${safeMessage}` : "."}`;
    if (code === "API_CONFIGURATION_MISSING") return "Currency availability check failed: the frontend API URL is not configured.";
    if (error?.request || code === "ERR_NETWORK") {
        return `Currency availability check failed: the API could not be reached${code ? ` (${code})` : ""}. Check the network, CORS settings, and API URL, then retry.`;
    }
    return `Currency availability check failed: ${error?.message || "unexpected response"}`.slice(0, 240);
}

export function unavailableDonationCurrencies(reason = "Availability could not be verified.") {
    return CURRENCY_OPTIONS.map((currency) => ({
        ...currency,
        providers: [],
        available: null,
        availability: "unknown",
        reason,
        unavailableReason: reason,
    }));
}

/** Normalize the supported API envelopes while never trusting the local
 * catalogue to imply that a payment provider can actually process a currency.
 */
export function normalizeDonationCurrencies(response) {
    const body = response?.data ?? response;
    const payload = body?.data ?? body;
    const entries = Array.isArray(payload) ? payload : payload?.currencies;
    if (!Array.isArray(entries)) {
        throw new Error("The payment service returned an invalid currency response (expected data.currencies).");
    }
    if (entries.length === 0) {
        throw new Error("The payment service returned an empty currency catalogue.");
    }
    if (entries.some((entry) => !entry || typeof entry.code !== "string")) {
        throw new Error("The payment service returned malformed currency entries.");
    }

    const byCode = new Map(entries.map((entry) => [String(entry?.code || "").toUpperCase(), entry]));
    const missingCodes = CURRENCY_OPTIONS.map(({ code }) => code).filter((code) => !byCode.has(code));
    if (missingCodes.length) {
        throw new Error(`The payment service returned an incomplete currency catalogue (${missingCodes.join(", ")}).`);
    }
    const currencies = CURRENCY_OPTIONS.map((definition) => {
        const entry = byCode.get(definition.code);
        if (typeof entry.available !== "boolean" || !Array.isArray(entry.providers)) {
            throw new Error(`The payment service returned malformed availability for ${definition.code}.`);
        }

        const providers = entry.providers
                  .map((provider) => {
                      if (typeof provider === "string") {
                          const id = provider.toLowerCase();
                          return PROVIDER_LABELS[id] ? { id, label: PROVIDER_LABELS[id] } : null;
                      }
                      if (!provider || typeof provider.id !== "string") return null;
                      const id = provider.id.toLowerCase();
                      if (!PROVIDER_LABELS[id]) return null;
                      return {
                          id,
                          label: provider.label || PROVIDER_LABELS[id],
                      };
                  })
                  .filter(Boolean);
        const isProviderBacked = entry.available === true && providers.length > 0;
        const availability = entry.availability === "unknown"
            ? "unknown"
            : isProviderBacked
                ? "available"
                : "unavailable";
        const available = availability === "available";
        const reason = available
            ? ""
            : entry.unavailableReason || entry.reason || "No eligible payment provider is configured for this currency.";

        return {
            ...definition,
            providers,
            available: availability === "unknown" ? null : available,
            availability,
            reason,
            unavailableReason: reason,
        };
    });

    return { currencies, payload };
}

export const DONATION_STATUS_LABELS = {
    pending: "Pending",
    processing: "Processing",
    successful: "Verified successful",
    completed: "Legacy completed",
    failed: "Failed",
    abandoned: "Abandoned",
    refunded: "Refunded",
};

export const PROVIDER_LABELS = {
    paystack: "Paystack",
    paypal: "PayPal",
};

export function currencyMeta(code) {
    return CURRENCY_META[String(code || "").toUpperCase()] || null;
}

export function currencySymbol(code) {
    return currencyMeta(code)?.symbol || String(code || "").toUpperCase();
}

export function currencyLabel(code) {
    const meta = currencyMeta(code);
    return meta ? `${meta.code} — ${meta.name}` : String(code || "").toUpperCase();
}

export function formatCurrency(amount, code = "NGN", { decimals } = {}) {
    const value = Number(amount);
    const safeValue = Number.isFinite(value) ? value : 0;
    const symbol = currencySymbol(code);
    const fractionDigits =
        decimals !== undefined
            ? Math.max(0, Math.min(4, Number(decimals)))
            : Number.isInteger(safeValue)
              ? 0
              : 2;

    const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(Math.abs(safeValue));

    return `${safeValue < 0 ? "-" : ""}${symbol}${formatted}`;
}

export function formatCurrencyWithCode(amount, code = "NGN", options) {
    return `${formatCurrency(amount, code, options)} ${String(code || "").toUpperCase()}`;
}

export function donationStatusLabel(status, verifiedAt) {
    if (status === "successful") return verifiedAt ? "Verified" : "Successful (unverified)";
    return DONATION_STATUS_LABELS[status] || status || "Pending";
}
