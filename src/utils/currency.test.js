import test from "node:test";
import assert from "node:assert/strict";
import {
    CURRENCY_OPTIONS,
    currencyAvailabilityErrorMessage,
    normalizeDonationCurrencies,
    unavailableDonationCurrencies,
} from "./currency.js";

test("fallback keeps all nine currencies visible with unknown availability", () => {
    const currencies = unavailableDonationCurrencies();
    assert.equal(currencies.length, 9);
    assert.ok(currencies.every(({ available, availability, providers }) => available === null && availability === "unknown" && providers.length === 0));
    assert.ok(currencies.every(({ unavailableReason }) => Boolean(unavailableReason)));
    assert.deepEqual(currencies.map(({ code }) => code), [
        "NGN", "USD", "GBP", "EUR", "CAD", "AUD", "GHS", "KES", "ZAR",
    ]);
});

test("normalizes both API response envelopes and only enables provider-backed currencies", () => {
    const entries = CURRENCY_OPTIONS.map((currency) => ({
        code: currency.code,
        available: currency.code === "NGN",
        providers: currency.code === "NGN" ? [{ id: "paystack", label: "Paystack" }] : [],
    }));

    for (const response of [
        { data: { success: true, statusCode: 200, data: { currencies: entries, defaultCurrency: "NGN" } } },
        { data: { currencies: entries, defaultCurrency: "NGN" } },
        { success: true, data: { currencies: entries, defaultCurrency: "NGN" } },
    ]) {
        const result = normalizeDonationCurrencies(response);
        assert.equal(result.currencies.length, 9);
        assert.equal(result.currencies.find(({ code }) => code === "NGN").available, true);
    assert.equal(result.currencies.find(({ code }) => code === "NGN").availability, "available");
        assert.equal(result.currencies.find(({ code }) => code === "USD").available, false);
    }
});

test("does not trust an available flag without an eligible provider", () => {
    const entries = CURRENCY_OPTIONS.map((currency) => ({ ...currency, available: true, providers: [] }));
    const result = normalizeDonationCurrencies({ data: { currencies: entries } });
    assert.ok(result.currencies.every(({ available }) => !available));

    const unknownProvider = normalizeDonationCurrencies({
        data: {
            currencies: CURRENCY_OPTIONS.map((currency) => ({
                code: currency.code,
                available: true,
                providers: currency.code === "USD" ? [{ id: "unimplemented-provider" }] : [],
            })),
        },
    });
    assert.equal(unknownProvider.currencies.find(({ code }) => code === "USD").available, false);
    assert.throws(() => normalizeDonationCurrencies({ data: { data: { currencies: [] } } }), /empty currency catalogue/i);
});

test("rejects malformed and incomplete API responses instead of normalizing them as empty", () => {
    assert.throws(() => normalizeDonationCurrencies({ data: { data: {} } }), /invalid currency response/i);
    assert.throws(() => normalizeDonationCurrencies({ data: { currencies: [{ code: "NGN" }] } }), /incomplete currency catalogue/i);
});

test("reports HTTP, server, network and CORS verification failures without hiding the cause", () => {
    assert.match(currencyAvailabilityErrorMessage({ response: { status: 401, data: { message: "No token provided." } } }), /HTTP 401.*No token provided/i);
    assert.match(currencyAvailabilityErrorMessage({ response: { status: 500, data: { message: "Not allowed by CORS" } } }), /HTTP 500.*Not allowed by CORS/i);
    assert.match(currencyAvailabilityErrorMessage({ code: "ERR_NETWORK", request: {} }), /ERR_NETWORK.*network/i);
    assert.doesNotMatch(currencyAvailabilityErrorMessage({ response: { status: 500, data: { message: "secret=sk_live_do_not_show" } } }), /sk_live_do_not_show/);
});
