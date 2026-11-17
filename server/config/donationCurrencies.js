/**
 * Currency and payment-provider capability configuration.
 *
 * A currency is only advertised to donors when at least one *configured*
 * provider can genuinely process it. We never convert between currencies:
 * the donor is charged the exact amount they selected, in their currency.
 */

export const CURRENCY_DEFINITIONS = {
    NGN: {
        code: "NGN",
        name: "Nigerian Naira",
        symbol: "₦",
        decimals: 2,
        presets: [5000, 10000, 25000, 50000, 100000],
        minimum: 100,
        maximum: 10000000,
    },
    USD: {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        decimals: 2,
        presets: [10, 25, 50, 100, 250],
        minimum: 2,
        maximum: 50000,
    },
    GBP: {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        decimals: 2,
        presets: [5, 10, 25, 50, 100],
        minimum: 1,
        maximum: 40000,
    },
    EUR: {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        decimals: 2,
        presets: [5, 10, 25, 50, 100],
        minimum: 1,
        maximum: 40000,
    },
    CAD: {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "CA$",
        decimals: 2,
        presets: [10, 25, 50, 100, 250],
        minimum: 2,
        maximum: 60000,
    },
    AUD: {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        decimals: 2,
        presets: [10, 25, 50, 100, 250],
        minimum: 2,
        maximum: 60000,
    },
    GHS: {
        code: "GHS",
        name: "Ghanaian Cedi",
        symbol: "GH₵",
        decimals: 2,
        presets: [50, 100, 250, 500, 1000],
        minimum: 1,
        maximum: 500000,
    },
    KES: {
        code: "KES",
        name: "Kenyan Shilling",
        symbol: "KSh",
        decimals: 2,
        presets: [500, 1000, 2500, 5000, 10000],
        minimum: 50,
        maximum: 5000000,
    },
    ZAR: {
        code: "ZAR",
        name: "South African Rand",
        symbol: "R",
        decimals: 2,
        presets: [100, 250, 500, 1000, 2500],
        minimum: 10,
        maximum: 500000,
    },
};

/**
 * Provider capabilities are limited to currencies the provider publicly
 * supports and that this project understands how to format/validate. A
 * provider's credentials alone do not establish merchant eligibility for a
 * currency that requires account approval.
 *
 * Paystack can process several currencies, but only the local currency of the
 * merchant account's country is guaranteed. International currencies require
 * activation on the account, so they are opt-in through
 * PAYSTACK_SUPPORTED_CURRENCIES rather than advertised by default.
 */
const PAYSTACK_COUNTRY_CURRENCIES = {
    NG: ["NGN"],
    GH: ["GHS"],
    KE: ["KES"],
    ZA: ["ZAR"],
};

const PROVIDER_DEFINITIONS = {
    paystack: {
        id: "paystack",
        label: "Paystack",
        nativeCurrencies: ["NGN", "USD", "GHS", "KES", "ZAR"],
        defaultCurrencies: () =>
            PAYSTACK_COUNTRY_CURRENCIES[
                process.env.PAYSTACK_ACCOUNT_COUNTRY?.trim().toUpperCase() || ""
            ] || [],
        isConfigured: () =>
            /^sk_(?:test|live)_[A-Za-z0-9]+$/.test(process.env.PAYSTACK_SECRET_KEY?.trim() || ""),
        currencyOverride: () => process.env.PAYSTACK_SUPPORTED_CURRENCIES,
    },
    paypal: {
        id: "paypal",
        label: "PayPal",
        nativeCurrencies: ["USD", "GBP", "EUR", "CAD", "AUD"],
        // PayPal merchant currency availability varies by account and country.
        // Require an explicit allow-list after account eligibility is checked.
        defaultCurrencies: () => [],
        isConfigured: () =>
            hasConfiguredValue(process.env.PAYPAL_CLIENT_ID) &&
            hasConfiguredValue(process.env.PAYPAL_CLIENT_SECRET),
        currencyOverride: () => process.env.PAYPAL_SUPPORTED_CURRENCIES,
    },
};

const DEFAULT_PROVIDER_PRIORITY = ["paystack", "paypal"];
const SUPPORTED_CODES = Object.keys(CURRENCY_DEFINITIONS);

function hasConfiguredValue(value) {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    if (trimmed.length < 8) return false;
    return !/^(your|replace|changeme|change-me|placeholder|example|xxx)/i.test(trimmed);
}

function parseCurrencyList(value) {
    if (!value) return null;
    const parsed = value
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter((item) => SUPPORTED_CODES.includes(item));
    return parsed.length ? Array.from(new Set(parsed)) : null;
}

function providerCurrencyList(provider) {
    const override = parseCurrencyList(provider.currencyOverride());
    const allowed = override || provider.defaultCurrencies();
    return allowed.filter((code) => provider.nativeCurrencies.includes(code));
}

function providerPriority() {
    const configured = process.env.PAYMENT_PROVIDER_PRIORITY
        ?.split(",")
        .map((item) => item.trim().toLowerCase())
        .filter((item) => PROVIDER_DEFINITIONS[item]);
    return configured?.length ? configured : DEFAULT_PROVIDER_PRIORITY;
}

export function getCurrencyDefinition(code) {
    if (!code) return null;
    return CURRENCY_DEFINITIONS[String(code).trim().toUpperCase()] || null;
}

export function isKnownCurrency(code) {
    return Boolean(getCurrencyDefinition(code));
}

export function getEnabledProviders() {
    return providerPriority()
        .map((id) => PROVIDER_DEFINITIONS[id])
        .filter((provider) => provider && provider.isConfigured())
        .map((provider) => ({
            id: provider.id,
            label: provider.label,
            currencies: providerCurrencyList(provider),
        }));
}

export function getProviderDefinition(providerId) {
    return PROVIDER_DEFINITIONS[String(providerId || "").toLowerCase()] || null;
}

/**
 * Returns enabled providers that can process the supplied currency, in the
 * configured priority order. The first entry is the preferred provider.
 */
export function getProviderIdsForCurrency(currency) {
    const code = String(currency || "").trim().toUpperCase();
    return getEnabledProviders()
        .filter((provider) => provider.currencies.includes(code))
        .map((provider) => provider.id);
}

export function isCurrencyAvailable(currency) {
    return getProviderIdsForCurrency(currency).length > 0;
}

/**
 * Public currency catalogue. Always returns all known currencies with
 * availability metadata. The `availableOnly` flag is kept for API
 * compatibility but does not remove currencies from the catalogue;
 * the frontend uses the `available` field to control selection.
 */
export function getCurrencyOptions(_options = {}) {
    const enabledProviders = getEnabledProviders();
    return Object.values(CURRENCY_DEFINITIONS).map((currency) => {
        const providers = enabledProviders.filter((provider) =>
            provider.currencies.includes(currency.code)
        );
        // Determine a user-friendly reason if the currency is unavailable
        let reason = null;
        if (providers.length === 0 && enabledProviders.length > 0) {
            reason = `Not supported by ${enabledProviders.map((p) => p.label).join(
                ", "
            )} payment provider${
                enabledProviders.length > 1 ? "s" : ""
            } currently configured.`;
        } else if (providers.length === 0 && enabledProviders.length === 0) {
            reason = "No payment provider is configured. Contact the church office.";
        }
        return {
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            decimals: currency.decimals,
            presets: currency.presets,
            minimum: currency.minimum,
            maximum: currency.maximum,
            providers: providers.map((provider) => ({
                id: provider.id,
                label: provider.label,
            })),
            available: providers.length > 0,
            availability: providers.length > 0 ? "available" : "unavailable",
            reason,
            unavailableReason: reason,
        };
    });
    // NOTE: the previous .filter((c) => availableOnly ? c.available : true)
    // has been removed so that all currencies remain in the catalogue.
    // The frontend uses the `available` field to disable unsupported options.
}

export function getDefaultCurrency() {
    const available = getCurrencyOptions().filter((currency) => currency.available);
    // Keep NGN preselected for the giving form; eligibility is still checked
    // separately and the API never reports it payable without a provider.
    if (!available.length) return "NGN";
    const configuredDefault = process.env.DEFAULT_DONATION_CURRENCY?.trim().toUpperCase();
    const preferred = available.find((currency) => currency.code === configuredDefault);
    if (preferred) return preferred.code;
    return available.some((currency) => currency.code === "NGN") ? "NGN" : available[0].code;
}

export function getMinimumAmount(currency) {
    return getCurrencyDefinition(currency)?.minimum ?? 1;
}

export function getMaximumAmount(currency) {
    return getCurrencyDefinition(currency)?.maximum ?? 1000000;
}

export function amountToMinorUnits(amount, currency = "NGN") {
    const definition = getCurrencyDefinition(currency);
    const decimals = definition?.decimals ?? 2;
    const factor = 10 ** decimals;
    return Math.round(Number(amount) * factor);
}

export function minorUnitsToAmount(amountMinor, currency = "NGN") {
    const definition = getCurrencyDefinition(currency);
    const decimals = definition?.decimals ?? 2;
    return Number(amountMinor) / 10 ** decimals;
}
