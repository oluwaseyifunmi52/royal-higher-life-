import test from "node:test";
import assert from "node:assert/strict";
import { getCurrencyOptions, getDefaultCurrency } from "../config/donationCurrencies.js";
import { createDonation, getCurrencies } from "../controllers/donationController.js";

const environmentKeys = [
    "PAYSTACK_SECRET_KEY",
    "PAYSTACK_WEBHOOK_SECRET",
    "PAYSTACK_ACCOUNT_COUNTRY",
    "PAYSTACK_SUPPORTED_CURRENCIES",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_SUPPORTED_CURRENCIES",
    "PAYMENT_PROVIDER_PRIORITY",
    "DEFAULT_DONATION_CURRENCY",
];

async function withPaymentEnvironment(values, callback) {
    const previous = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
    environmentKeys.forEach((key) => delete process.env[key]);
    Object.assign(process.env, values);
    try {
        await callback();
    } finally {
        for (const key of environmentKeys) {
            if (previous[key] === undefined) delete process.env[key];
            else process.env[key] = previous[key];
        }
    }
}

test("catalogue always includes all nine currencies without enabling payments", async () => {
    await withPaymentEnvironment({}, () => {
        const currencies = getCurrencyOptions({ availableOnly: true });
        assert.deepEqual(currencies.map(({ code }) => code), [
            "NGN", "USD", "GBP", "EUR", "CAD", "AUD", "GHS", "KES", "ZAR",
        ]);
        assert.ok(currencies.every(({ available, providers }) => !available && providers.length === 0));
        assert.ok(currencies.every(({ code, name, symbol, unavailableReason }) => code && name && symbol && unavailableReason));
        assert.equal(currencies.find(({ code }) => code === "GHS").symbol, "GH₵");
        assert.equal(getDefaultCurrency(), "NGN");
    });
});

test("Paystack enables only its configured account-country currency by default", async () => {
    await withPaymentEnvironment(
        { PAYSTACK_SECRET_KEY: "sk_test_currencycatalogue" },
        () => assert.ok(getCurrencyOptions().every(({ available }) => !available))
    );

    await withPaymentEnvironment(
        { PAYSTACK_SECRET_KEY: "sk_test_currencycatalogue", PAYSTACK_ACCOUNT_COUNTRY: "NG" },
        () => {
            const currencies = getCurrencyOptions();
            assert.deepEqual(currencies.filter(({ available }) => available).map(({ code }) => code), ["NGN"]);
            assert.deepEqual(currencies.find(({ code }) => code === "NGN").providers.map(({ id }) => id), ["paystack"]);
            assert.equal(getDefaultCurrency(), "NGN");
        }
    );
});

test("Paystack credentials without a recognized test/live secret-key prefix do not enable currencies", async () => {
    await withPaymentEnvironment(
        { PAYSTACK_SECRET_KEY: "not-a-paystack-secret", PAYSTACK_ACCOUNT_COUNTRY: "NG" },
        () => assert.ok(getCurrencyOptions().every(({ available }) => !available))
    );
});

test("PayPal currencies require an explicit merchant-eligibility allow-list", async () => {
    await withPaymentEnvironment(
        { PAYPAL_CLIENT_ID: "client_id_for_tests", PAYPAL_CLIENT_SECRET: "client_secret_for_tests" },
        () => assert.ok(getCurrencyOptions().every(({ available }) => !available))
    );

    await withPaymentEnvironment(
        {
            PAYPAL_CLIENT_ID: "client_id_for_tests",
            PAYPAL_CLIENT_SECRET: "client_secret_for_tests",
            PAYPAL_SUPPORTED_CURRENCIES: "GBP",
        },
        () => {
            const currencies = getCurrencyOptions();
            assert.deepEqual(currencies.filter(({ available }) => available).map(({ code }) => code), ["GBP"]);
            assert.deepEqual(currencies.find(({ code }) => code === "GBP").providers.map(({ id }) => id), ["paypal"]);
        }
    );
});

test("public currency endpoint returns the full catalogue and provider status", async () => {
    await withPaymentEnvironment({}, async () => {
        let responseBody;
        await getCurrencies({}, { json(body) { responseBody = body; } });
        assert.equal(responseBody.success, true);
        assert.equal(responseBody.data.currencies.length, 9);
        assert.deepEqual(responseBody.data.currencies.map(({ code }) => code), [
            "NGN", "USD", "GBP", "EUR", "CAD", "AUD", "GHS", "KES", "ZAR",
        ]);
        assert.equal(responseBody.data.defaultCurrency, "NGN");
        assert.ok(responseBody.data.currencies.every(({ available, providers }) => !available && providers.length === 0));
        assert.ok(responseBody.data.currencies.every(({ availability }) => availability === "unavailable"));
        assert.ok(responseBody.data.currencies.every(({ unavailableReason }) => Boolean(unavailableReason)));
        assert.ok(responseBody.data.currencies.every(({ symbol }) => symbol !== "#"));
    });
});

test("donation creation rejects currencies without a configured eligible provider", async () => {
    await withPaymentEnvironment({}, async () => {
        const response = {
            statusCode: 200,
            status(code) {
                this.statusCode = code;
                return this;
            },
            json(body) {
                this.body = body;
                return this;
            },
        };
        await createDonation(
            { body: { firstName: "Test", lastName: "Donor", email: "test@example.com", currency: "USD" } },
            response
        );
        assert.equal(response.statusCode, 400);
        assert.match(response.body.message, /not available/i);
    });
});
