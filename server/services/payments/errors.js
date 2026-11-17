export class PaymentProviderError extends Error {
    constructor(message, { provider, code = "PAYMENT_PROVIDER_ERROR", statusCode = 502, cause } = {}) {
        super(message);
        this.name = "PaymentProviderError";
        this.provider = provider;
        this.code = code;
        this.statusCode = statusCode;
        this.cause = cause;
    }
}

export class PaymentNotConfiguredError extends PaymentProviderError {
    constructor(provider) {
        super(`${provider || "The payment provider"} is not configured.`, {
            provider,
            code: "PAYMENT_NOT_CONFIGURED",
            statusCode: 503,
        });
        this.name = "PaymentNotConfiguredError";
    }
}
