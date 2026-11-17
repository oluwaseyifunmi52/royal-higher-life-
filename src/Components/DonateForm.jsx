import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    processDonation,
    getDonationCampaigns,
    getDonationCurrencies,
} from "../services/donationService.js";
import { FaLock, FaCreditCard, FaReceipt } from "react-icons/fa";
import {
    currencySymbol,
    formatCurrency,
    currencyAvailabilityErrorMessage,
    normalizeDonationCurrencies,
    unavailableDonationCurrencies,
} from "../utils/currency.js";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    currency: "",
    purpose: "General Offering",
    message: "",
    anonymous: false,
    campaignId: "",
};

function friendlyError(error) {
    if (error?.response) {
        return (
            error.response.data?.message ||
            "Your donation could not be started. Please try again."
        );
    }
    if (error?.request) {
        return "Unable to connect to the payment server. Please check your connection and try again.";
    }
    return error?.message || "Your donation could not be started. Please try again.";
}

function logAvailabilityFailure(error) {
    console.error("Donation currency availability check failed.", {
        status: error?.response?.status || null,
        code: error?.code || null,
        route: "/api/donations/currencies",
        message: currencyAvailabilityErrorMessage(error),
    });
}

export default function DonationForm() {
    const [form, setForm] = useState(initialForm);
    const [campaigns, setCampaigns] = useState([]);
    const [currencies, setCurrencies] = useState(() => unavailableDonationCurrencies());
    const [status, setStatus] = useState(null);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);
    const [currencyError, setCurrencyError] = useState("");
    const loading = status?.type === "loading";

    const loadCurrencies = useCallback(async (isCurrent = () => true) => {
        setLoadingCurrencies(true);
        setCurrencyError("");
        try {
            const response = await getDonationCurrencies();
            if (!isCurrent()) return;
            const normalized = normalizeDonationCurrencies(response);

            const { currencies: options } = normalized;
            setCurrencies(options);
            setForm((current) => {
                if (current.currency && options.some((item) => item.code === current.currency && item.availability !== "unavailable")) {
                    return current;
                }
                return { ...current, currency: "", amount: "", campaignId: "" };
            });
            return normalized;
        } catch (error) {
            if (!isCurrent()) return;
            const message = currencyAvailabilityErrorMessage(error);
            logAvailabilityFailure(error);
            setCurrencies(unavailableDonationCurrencies(message));
            setCurrencyError(message);
            return { currencies: [], error: message };
        } finally {
            if (isCurrent()) setLoadingCurrencies(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        loadCurrencies(() => active);
        return () => {
            active = false;
        };
    }, [loadCurrencies]);

    useEffect(() => {
        getDonationCampaigns()
            .then((response) => {
                const payload = response.data?.data;
                setCampaigns(Array.isArray(payload) ? payload : []);
            })
            .catch(() => setCampaigns([]));
    }, []);

    const selectedCurrency = useMemo(
        () => currencies.find((item) => item.code === form.currency) || null,
        [currencies, form.currency]
    );
    const activeCurrency = useMemo(
        () => currencies.find((item) => item.code === form.currency && item.available) || null,
        [currencies, form.currency]
    );
    const availableCurrencyCodes = useMemo(
        () => new Set(currencies.filter((item) => item.available).map((item) => item.code)),
        [currencies]
    );
    const presets = activeCurrency?.presets || [];
    const amountNumber = Number(form.amount);
    const selectedCampaign =
        campaigns.find((campaign) => campaign._id === form.campaignId) || null;
    const providers = activeCurrency?.providers || [];
    const providerNames = providers.map((provider) => provider.label).join(" or ");

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
        setStatus(null);
    }

    function handleCurrencyChange(event) {
        const code = event.target.value;
        setForm((current) => {
            const campaign = campaigns.find((item) => item._id === current.campaignId);
            const keepCampaign = Boolean(campaign && campaign.currency === code);
            return {
                ...current,
                currency: code,
                amount: "",
                campaignId: keepCampaign ? current.campaignId : "",
            };
        });
        setStatus(null);
    }

    function selectPreset(amount) {
        setForm((current) => ({ ...current, amount: String(amount) }));
        setStatus(null);
    }

    function handleCampaignChange(event) {
        const campaignId = event.target.value;
        const campaign = campaigns.find((item) => item._id === campaignId);
        if (campaign && !availableCurrencyCodes.has(campaign.currency)) {
            setStatus({
                type: "error",
                text: `This campaign is not accepting online donations in ${campaign.currency} yet.`,
            });
            return;
        }
        const currencyChanged = Boolean(campaign && campaign.currency !== form.currency);
        setForm((current) => {
            if (!campaign) return { ...current, campaignId: "" };
            return {
                ...current,
                campaignId,
                currency: campaign.currency,
                amount: current.currency === campaign.currency ? current.amount : "",
            };
        });
        setStatus(
            currencyChanged
                ? {
                      type: "info",
                      text: `This campaign is funded in ${campaign.currency}. The currency was switched to ${campaign.currency} — please enter or confirm your amount.`,
                  }
                : null
        );
    }

    function chooseCampaign(campaign) {
        if (!availableCurrencyCodes.has(campaign.currency)) {
            setStatus({
                type: "error",
                text: `This campaign is not accepting online donations in ${campaign.currency} yet.`,
            });
            return;
        }
        const currencyChanged = campaign.currency !== form.currency;
        setForm((current) => ({
            ...current,
            campaignId: campaign._id,
            currency: campaign.currency,
            amount: "",
        }));
        setStatus(
            currencyChanged
                ? {
                      type: "info",
                      text: `This campaign is funded in ${campaign.currency}. The currency was switched to ${campaign.currency} — please enter your amount.`,
                  }
                : null
        );
        document.getElementById("donation-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    async function submitHandler(event) {
        event.preventDefault();
        if (loading || loadingCurrencies) return;

        if (!selectedCurrency || selectedCurrency.availability === "unavailable") {
            setStatus({
                type: "error",
                text: "Choose a currency that is available for online giving before continuing.",
            });
            return;
        }
        if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
            setStatus({ type: "error", text: "Enter a valid donation amount." });
            return;
        }
        if (amountNumber < selectedCurrency.minimum) {
            setStatus({
                type: "error",
                text: `The minimum ${selectedCurrency.code} donation is ${formatCurrency(
                    selectedCurrency.minimum,
                    selectedCurrency.code
                )}.`,
            });
            return;
        }
        if (amountNumber > selectedCurrency.maximum) {
            setStatus({
                type: "error",
                text: `The maximum ${selectedCurrency.code} donation is ${formatCurrency(
                    selectedCurrency.maximum,
                    selectedCurrency.code
                )}.`,
            });
            return;
        }

        setStatus({ type: "loading", text: "Rechecking currency availability…" });
        try {
            const verification = await loadCurrencies();
            const verifiedCurrency = verification?.currencies.find((item) => item.code === form.currency);
            if (!verifiedCurrency?.available) {
                setStatus({
                    type: "error",
                    text: verifiedCurrency?.unavailableReason || verification?.error || currencyError || "Currency availability could not be verified. Retry the availability check before payment.",
                });
                return;
            }
            setStatus({ type: "loading", text: "Starting secure checkout…" });
            const response = await processDonation({
                ...form,
                amount: amountNumber,
                currency: form.currency,
                campaignId: form.campaignId || undefined,
            });
            const result = response.data?.data;
            if (!result?.authorizationUrl || !result?.reference) {
                throw new Error(
                    "The payment provider did not return a checkout link. Please try again."
                );
            }
            sessionStorage.setItem("rhlm_pending_donation_reference", result.reference);
            window.location.assign(result.authorizationUrl);
        } catch (error) {
            setStatus({ type: "error", text: friendlyError(error) });
        }
    }

    return (
        <section className="donation-section" aria-labelledby="donation-heading">
            <div className="donation-container">
                {campaigns.length > 0 && (
                    <section className="donation-campaigns" aria-label="Active ministry campaigns">
                        <h2>Current campaigns</h2>
                        <div className="campaign-grid">
                            {campaigns.map((campaign) => {
                                const campaignCurrency = campaign.currency || "NGN";
                                const online = availableCurrencyCodes.has(campaignCurrency);
                                return (
                                    <article className="campaign-card" key={campaign._id}>
                                        {campaign.coverImage && (
                                            <img src={campaign.coverImage} alt="" loading="lazy" />
                                        )}
                                        <h3>{campaign.title}</h3>
                                        <p>{campaign.description}</p>
                                        <p>
                                            <strong>
                                                {formatCurrency(
                                                    campaign.raisedAmount || 0,
                                                    campaignCurrency
                                                )}
                                            </strong>{" "}
                                            raised of{" "}
                                            {formatCurrency(
                                                campaign.targetAmount,
                                                campaignCurrency
                                            )}{" "}
                                            {campaignCurrency}
                                        </p>
                                        <progress
                                            max="100"
                                            value={campaign.progressPercent || 0}
                                            aria-label={`${campaign.progressPercent || 0}% funded`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => chooseCampaign(campaign)}
                                            disabled={!online}
                                        >
                                            {online
                                                ? "Give to this campaign"
                                                : `Online giving in ${campaignCurrency} is not available yet`}
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="donation-grid"
                >
                    <div className="donation-left">
                        <p className="donation-subtitle">Secure Giving</p>
                        <h2 className="donation-title" id="donation-heading">
                            Support God’s Work
                        </h2>
                        <p className="donation-description">
                            Give as a guest—an account is not required. Payments are securely
                            processed by a configured payment partner and marked complete only
                            after server verification.
                        </p>
                        <div className="security-list" aria-label="Donation security information">
                            <div className="security-item">
                                <FaLock aria-hidden="true" />
                                <span>Secure hosted checkout</span>
                            </div>
                            <div className="security-item">
                                <FaCreditCard aria-hidden="true" />
                                <span>Card and supported local payment methods</span>
                            </div>
                            <div className="security-item">
                                <FaReceipt aria-hidden="true" />
                                <span>Email receipt after verification</span>
                            </div>
                        </div>
                        <p>
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                        <p>
                            <Link to="/donations/track">Track a donation or get a receipt</Link>
                        </p>
                    </div>

                    <motion.form
                        id="donation-form"
                        onSubmit={submitHandler}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="donation-form"
                    >
                        <h3 className="form-title">Make a Donation</h3>

                        <div className="form-grid-2">
                            <div className="field-group">
                                <label className="field-label" htmlFor="firstName">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    autoComplete="given-name"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    maxLength={60}
                                />
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="lastName">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    maxLength={60}
                                />
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="field-group">
                                <label className="field-label" htmlFor="donation-email">
                                    Email address (for receipt)
                                </label>
                                <input
                                    id="donation-email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    maxLength={254}
                                />
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="phone">
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    maxLength={40}
                                />
                            </div>
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="donation-currency">
                                Currency
                            </label>
                            <select
                                id="donation-currency"
                                name="currency"
                                value={form.currency}
                                onChange={handleCurrencyChange}
                                required
                                aria-busy={loadingCurrencies}
                            >
                                <option value="" disabled>
                                    Select currency
                                </option>
                                {currencies.map((currency) => {
                                    const availability = currency.availability || (currency.available ? "available" : "unavailable");
                                    const isAvailable = availability === "available";
                                    const isUnknown = availability === "unknown";
                                    return (
                                        <option
                                            key={currency.code}
                                            value={currency.code}
                                            disabled={availability === "unavailable"}
                                            style={{
                                                color: isAvailable
                                                    ? "var(--text)"
                                                    : "var(--text-muted)",
                                            }}
                                        >
                                            {currency.code} — {currency.name} {currency.symbol}
                                            {isUnknown
                                                ? " — Verification pending; selectable and checked again before payment"
                                                : !isAvailable
                                                    ? ` — Unavailable: ${currency.unavailableReason || currency.reason}`
                                                    : ""}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="field-group">
                            <label className="field-label" htmlFor="amount">
                                Donation amount
                            </label>
                            <div className="amount-input-wrap">
                                <span className="amount-currency-symbol" aria-hidden="true">
                                    {activeCurrency?.symbol || currencySymbol(form.currency)}
                                </span>
                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min={activeCurrency?.minimum ?? 1}
                                    max={activeCurrency?.maximum}
                                    step="0.01"
                                    inputMode="decimal"
                                    placeholder={presets[0] ? String(presets[0]) : "0.00"}
                                    aria-describedby="amount-help"
                                    required
                                />
                                <span className="amount-currency-code">
                                    {form.currency || "—"}
                                </span>
                            </div>
                            <small className="field-hint" id="amount-help">
                                {selectedCurrency
                                    ? `Minimum ${formatCurrency(
                                          selectedCurrency.minimum,
                                          selectedCurrency.code
                                      )}. You are charged in ${selectedCurrency.code}.`
                                    : availableCurrencyCodes.size > 0
                                      ? "Choose an available currency above to see the amount limits."
                                      : "Online giving is currently unavailable. Contact the church office."
                                }
                            </small>
                        </div>

                        {presets.length > 0 && (
                            <div className="amount-grid" aria-label="Suggested donation amounts">
                                {presets.map((amount) => (
                                    <button
                                        key={`${form.currency}-${amount}`}
                                        type="button"
                                        className={`amount-btn ${
                                            amountNumber === amount ? "active" : ""
                                        }`}
                                        aria-pressed={amountNumber === amount}
                                        onClick={() => selectPreset(amount)}
                                    >
                                        {formatCurrency(amount, form.currency, { decimals: 0 })}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="field-group">
                            <label className="field-label" htmlFor="campaign">
                                Campaign
                            </label>
                            <select
                                id="campaign"
                                name="campaignId"
                                value={form.campaignId}
                                onChange={handleCampaignChange}
                            >
                                <option value="">General Ministry Support</option>
                                {campaigns.map((campaign) => (
                                    <option
                                        key={campaign._id}
                                        value={campaign._id}
                                        disabled={!availableCurrencyCodes.has(campaign.currency)}
                                    >
                                        {campaign.title} ({campaign.currency})
                                        {availableCurrencyCodes.has(campaign.currency)
                                            ? ""
                                            : " — online giving unavailable"}
                                    </option>
                                ))}
                            </select>
                            {selectedCampaign && (
                                <small className="field-hint">
                                    This campaign is funded in {selectedCampaign.currency}. Your
                                    gift will be recorded in {selectedCampaign.currency}.
                                </small>
                            )}
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="purpose">
                                Donation purpose
                            </label>
                            <select
                                id="purpose"
                                name="purpose"
                                value={form.purpose}
                                onChange={handleChange}
                            >
                                {[
                                    "General Offering",
                                    "Church Planting",
                                    "Building Project",
                                    "Evangelism",
                                    "Mission Outreach",
                                    "Youth Ministry",
                                    "Children Ministry",
                                    "Bible Distribution",
                                    "Medical Outreach",
                                    "Community Support",
                                ].map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="message">
                                Message (optional)
                            </label>
                            <textarea
                                id="message"
                                rows="4"
                                name="message"
                                maxLength={2000}
                                value={form.message}
                                onChange={handleChange}
                            />
                        </div>

                        <label className="checkbox-row" htmlFor="anonymous">
                            <input
                                id="anonymous"
                                type="checkbox"
                                name="anonymous"
                                checked={form.anonymous}
                                onChange={handleChange}
                            />
                            <span>Display my gift anonymously</span>
                        </label>

                        {Number.isFinite(amountNumber) && amountNumber > 0 && activeCurrency && (
                            <div className="donation-charge-summary" aria-live="polite">
                                <span>You will be charged</span>
                                <strong>
                                    {formatCurrency(amountNumber, form.currency)}{" "}
                                    {form.currency}
                                </strong>
                                {providerNames && (
                                    <small>Processed securely by {providerNames}.</small>
                                )}
                                <small>
                                    No currency conversion is applied. Your bank or payment provider
                                    may add its own fees.
                                </small>
                            </div>
                        )}

                        {providerNames && (
                            <p className="donation-provider-note">
                                Payments in {form.currency} are processed by {providerNames}. Your
                                provider will show the payment methods available to you.
                            </p>
                        )}

                        {loadingCurrencies && (
                            <p className="donation-provider-note" role="status">
                                Loading available currencies…
                            </p>
                        )}

                        {!loadingCurrencies && currencyError && (
                            <div className="donation-status error" role="alert">
                                <p>{currencyError}</p>
                                <button
                                    type="button"
                                    className="donation-link-btn"
                                    onClick={() => loadCurrencies()}
                                    disabled={loadingCurrencies}
                                >
                                    {loadingCurrencies ? "Checking availability…" : "Retry availability check"}
                                </button>
                            </div>
                        )}
                        {!loadingCurrencies && !currencyError && availableCurrencyCodes.size === 0 && (
                            <p className="donation-status info" role="status">
                                All nine currencies are listed, but no eligible payment provider is currently
                                available. Contact the church office to enable online giving.
                            </p>
                        )}

                        <motion.button
                            type="submit"
                            whileHover={{ scale: loading ? 1 : 1.01 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            className="donate-btn"
                            disabled={loading || loadingCurrencies || !selectedCurrency || selectedCurrency.availability === "unavailable"}
                        >
                            {loading ? "Starting secure checkout…" : "Continue to Secure Payment"}
                        </motion.button>

                        {status && (
                            <p
                                className={`donation-status ${status.type}`}
                                role={status.type === "error" ? "alert" : "status"}
                                aria-live="polite"
                            >
                                {status.text}
                            </p>
                        )}
                    </motion.form>
                </motion.div>
            </div>
        </section>
    );
}
