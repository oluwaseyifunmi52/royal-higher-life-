import crypto from "crypto";
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import DonationCampaign from "../models/DonationCampaign.js";
import DonationAudit from "../models/DonationAudit.js";
import {
    amountToMinorUnits,
    CURRENCY_DEFINITIONS,
    getCurrencyDefinition,
    getCurrencyOptions,
    getDefaultCurrency,
    getEnabledProviders,
    getProviderDefinition,
    getProviderIdsForCurrency,
    isCurrencyAvailable,
    minorUnitsToAmount,
} from "../config/donationCurrencies.js";
import { getAdapter, getProvidersForCurrency } from "../services/payments/index.js";
import { PaymentProviderError } from "../services/payments/errors.js";
import { isEmailConfigured, sendDonationReceipt, sendTrackingCode } from "../services/emailService.js";
import { describeCampaign, getCampaignRaisedTotals } from "../services/donationStats.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TRACKING_CODE_TTL_MINUTES = 10;
const MAX_TRACKING_ATTEMPTS = 5;

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function clientBaseUrl() {
    return (process.env.CLIENT_URL?.trim() || "http://localhost:5173").replace(/\/$/, "");
}

function generatePaymentReference() {
    return `RHL-${Date.now().toString(36).toUpperCase()}-${crypto
        .randomBytes(4)
        .toString("hex")
        .toUpperCase()}`;
}

function generateReceiptNumber() {
    const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
    return `RHL-${date}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function trackingSecret() {
    return (
        process.env.DONATION_TRACKING_SECRET?.trim() ||
        process.env.JWT_SECRET?.trim() ||
        "royal-higherlife-donation-tracking"
    );
}

function hashTrackingCode({ reference, email, code }) {
    return crypto
        .createHmac("sha256", trackingSecret())
        .update(`${reference}:${String(email).toLowerCase()}:${code}`)
        .digest("hex");
}

function safeEqualHex(left, right) {
    if (!left || !right) return false;
    const a = Buffer.from(String(left), "utf8");
    const b = Buffer.from(String(right), "utf8");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function providerLabel(providerId) {
    return getProviderDefinition(providerId)?.label || "payment provider";
}

function amountMatchesDonation(donation, { amountMinor, amount, currency }) {
    const expectedMinor =
        donation.amountMinor !== null &&
        donation.amountMinor !== undefined &&
        Number.isFinite(Number(donation.amountMinor))
            ? Number(donation.amountMinor)
            : amountToMinorUnits(donation.amount, donation.currency);
    const actualMinor = Number.isFinite(Number(amountMinor))
        ? Number(amountMinor)
        : amountToMinorUnits(amount, donation.currency);
    return (
        actualMinor === expectedMinor &&
        String(currency || "").toUpperCase() === String(donation.currency).toUpperCase()
    );
}

async function recordAudit({ action, donation, campaign, actor, metadata = {} }) {
    try {
        await DonationAudit.create({ action, donation, campaign, actor, metadata });
    } catch (error) {
        console.warn("Could not write donation audit event.", {
            action,
            name: error?.name || "Error",
        });
    }
}

export function serializeDonation(donation, { includeDonor = false, includeProvider = true } = {}) {
    const campaign =
        donation.campaign && typeof donation.campaign === "object" && donation.campaign.title
            ? donation.campaign
            : null;

    return {
        id: donation._id,
        _id: donation._id,
        paymentReference: donation.paymentReference || "",
        amount: Number(donation.amount || 0),
        amountMinor:
            donation.amountMinor !== null && donation.amountMinor !== undefined
                ? donation.amountMinor
                : amountToMinorUnits(donation.amount, donation.currency || "NGN"),
        currency: donation.currency || "NGN",
        status: donation.status || "pending",
        verifiedAt: donation.verifiedAt || null,
        paidAt: donation.paidAt || null,
        createdAt: donation.createdAt,
        purpose: donation.purpose || "General Offering",
        donationType: donation.purpose || "General Offering",
        anonymous: Boolean(donation.anonymous),
        isAnonymous: Boolean(donation.anonymous),
        receiptNumber: donation.receiptNumber || "",
        ...(includeProvider
            ? {
                  provider: donation.provider || null,
                  providerStatus: donation.providerStatus || "",
                  verificationSource: donation.verificationSource || "",
                  receiptSentAt: donation.receiptSentAt || null,
              }
            : {}),
        ...(includeDonor
            ? {
                  firstName: donation.firstName || "",
                  lastName: donation.lastName || "",
                  donorName: `${donation.firstName || ""} ${donation.lastName || ""}`.trim(),
                  email: donation.email || "",
                  phone: donation.phone || "",
              }
            : {}),
        campaign: campaign
            ? {
                  id: campaign._id,
                  _id: campaign._id,
                  title: campaign.title,
                  slug: campaign.slug,
                  currency: campaign.currency,
              }
            : null,
    };
}

async function loadCampaignFor(donation) {
    if (!donation.campaign) return null;
    if (typeof donation.campaign === "object" && donation.campaign.title) return donation.campaign;
    return DonationCampaign.findById(donation.campaign).lean();
}

async function ensureReceipt(donation) {
    if (donation.receiptSentAt || !donation.email) return;
    if (!donation.receiptNumber) donation.receiptNumber = generateReceiptNumber();

    try {
        const campaign = await loadCampaignFor(donation);
        const result = await sendDonationReceipt({ donation, campaign });
        if (result.sent) {
            donation.receiptSentAt = new Date();
            donation.receiptError = "";
            await donation.save();
            await recordAudit({
                action: "receipt_sent",
                donation: donation._id,
                campaign: donation.campaign || null,
                metadata: { messageId: result.id || null },
            });
        } else {
            donation.receiptError = result.reason || "receipt_not_sent";
            await donation.save();
        }
    } catch (error) {
        console.warn("Donation receipt could not be sent.", { name: error?.name || "Error" });
        donation.receiptError = "receipt_delivery_failed";
        await donation.save().catch(() => {});
    }
}

async function markDonationSuccessful(
    donation,
    { paidAt, providerStatus, verificationSource, providerReference, providerTransactionId }
) {
    if (donation.status === "successful" && donation.verifiedAt) {
        await ensureReceipt(donation);
        return donation;
    }

    donation.status = "successful";
    donation.verifiedAt = new Date();
    donation.paidAt = paidAt || new Date();
    donation.providerStatus = providerStatus || "successful";
    donation.verificationSource = verificationSource;
    if (providerReference) donation.providerReference = providerReference;
    if (providerTransactionId) {
        donation.metadata = {
            ...(donation.metadata || {}),
            providerTransactionId,
        };
    }
    if (!donation.receiptNumber) donation.receiptNumber = generateReceiptNumber();

    await donation.save();
    await recordAudit({
        action: "donation_verified",
        donation: donation._id,
        campaign: donation.campaign || null,
        metadata: { verificationSource, provider: donation.provider, providerStatus },
    });
    await ensureReceipt(donation);
    return donation;
}

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

export async function getCurrencies(_req, res) {
    const configuredProviders = getEnabledProviders();
    const catalogue = new Map(getCurrencyOptions().map((currency) => [currency.code, currency]));
    const noProviderReason = "No payment provider is configured. Contact the church office.";
    const unavailableReason = configuredProviders.length
        ? `No configured payment provider can process this currency. Supported currencies: ${configuredProviders
              .map((provider) => `${provider.label} (${provider.currencies.join(", ") || "none"})`)
              .join("; ")}.`
        : noProviderReason;
    // Keep the public catalogue complete even if provider configuration is
    // empty or a later availability filter accidentally omits definitions.
    const currencies = Object.values(CURRENCY_DEFINITIONS).map((definition) =>
        catalogue.get(definition.code) || {
            ...definition,
            providers: [],
            available: false,
            availability: "unavailable",
            reason: unavailableReason,
            unavailableReason,
        }
    );
    const providers = configuredProviders.map(({ id, label }) => ({ id, label }));
    res.json({
        success: true,
        message: currencies.length
            ? "Donation currencies fetched."
            : "Online giving is not configured yet.",
        data: {
            currencies,
            defaultCurrency: getDefaultCurrency(),
            providers,
        },
    });
}

export async function getCampaigns(_req, res) {
    try {
        const campaigns = await DonationCampaign.find({ isActive: true })
            .sort({ createdAt: -1 })
            .lean();
        const totals = await getCampaignRaisedTotals(campaigns.map((campaign) => campaign._id));
        res.json({
            success: true,
            message: "Campaigns fetched.",
            data: campaigns.map((campaign) => describeCampaign(campaign, totals)),
        });
    } catch {
        res.status(500).json({ success: false, message: "Failed to fetch campaigns." });
    }
}

export async function createDonation(req, res) {
    let donation = null;
    try {
        const firstName = text(req.body.firstName, 100);
        const lastName = text(req.body.lastName, 100);
        const email = text(req.body.email, 254).toLowerCase();
        const phone = text(req.body.phone, 40);
        const purpose = text(req.body.purpose, 120) || "General Offering";
        const message = text(req.body.message, 2000);
        const anonymous = req.body.anonymous === true || req.body.isAnonymous === true;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, and email address are required.",
            });
        }
        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address for the receipt.",
            });
        }

        const campaignId = text(req.body.campaignId, 80);
        let campaign = null;
        if (campaignId) {
            if (!mongoose.isValidObjectId(campaignId)) {
                return res.status(400).json({ success: false, message: "Invalid campaign." });
            }
            campaign = await DonationCampaign.findById(campaignId);
            if (!campaign || !campaign.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "That campaign is no longer accepting donations.",
                });
            }
        }

        let currency = text(req.body.currency, 3).toUpperCase();
        if (!currency && campaign) currency = campaign.currency;
        const definition = getCurrencyDefinition(currency);
        if (!definition || !isCurrencyAvailable(currency)) {
            return res.status(400).json({
                success: false,
                message: currency
                    ? `Donations in ${currency} are not available right now. Please choose another currency.`
                    : "Choose a donation currency.",
            });
        }

        if (campaign && campaign.currency !== currency) {
            return res.status(400).json({
                success: false,
                message: `This campaign accepts donations in ${campaign.currency}. Please switch the currency to ${campaign.currency} or clear the campaign selection.`,
            });
        }

        const amount = Number(req.body.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid donation amount.",
            });
        }

        const amountMinor = amountToMinorUnits(amount, currency);
        const normalizedAmount = minorUnitsToAmount(amountMinor, currency);
        if (Math.abs(normalizedAmount - amount) > 1e-9) {
            return res.status(400).json({
                success: false,
                message:
                    definition.decimals > 0
                        ? `Donation amounts can have at most ${definition.decimals} decimal places.`
                        : "Donation amounts must be whole numbers in this currency.",
            });
        }
        if (amount < definition.minimum) {
            return res.status(400).json({
                success: false,
                message: `The minimum ${currency} donation is ${definition.symbol}${definition.minimum.toLocaleString("en-US")}.`,
            });
        }
        if (amount > definition.maximum) {
            return res.status(400).json({
                success: false,
                message: `The maximum ${currency} donation is ${definition.symbol}${definition.maximum.toLocaleString("en-US")}.`,
            });
        }

        const providers = getProvidersForCurrency(currency);
        if (!providers.length) {
            return res.status(400).json({
                success: false,
                message: `No configured payment provider can process ${currency} donations.`,
            });
        }

        const reference = generatePaymentReference();
        donation = await Donation.create({
            firstName,
            lastName,
            email,
            phone,
            amount: normalizedAmount,
            amountMinor,
            currency,
            purpose,
            message,
            anonymous,
            campaign: campaign?._id || null,
            userId: req.user?._id || null,
            paymentReference: reference,
            status: "pending",
            metadata: {},
        });

        const base = clientBaseUrl();
        const callbackUrl = `${base}/donations/complete?reference=${encodeURIComponent(reference)}`;
        const cancelUrl = `${base}/donations/complete?reference=${encodeURIComponent(
            reference
        )}&cancelled=1`;
        const metadata = {
            donationId: String(donation._id),
            purpose,
            campaignId: campaign?._id ? String(campaign._id) : undefined,
            donorName: `${firstName} ${lastName}`.trim(),
        };

        let initialized = null;
        let lastError = null;
        for (const { id, adapter } of providers) {
            try {
                const result = await adapter.initializeDonation({
                    amount: normalizedAmount,
                    amountMinor,
                    currency,
                    email,
                    reference,
                    donorName: `${firstName} ${lastName}`.trim(),
                    callbackUrl,
                    returnUrl: callbackUrl,
                    cancelUrl,
                    metadata,
                });
                initialized = { provider: id, ...result };
                break;
            } catch (error) {
                lastError = error;
                console.error("Payment initialization failed.", {
                    provider: id,
                    currency,
                    name: error?.name || "Error",
                    code: error?.code || "unknown",
                });
            }
        }

        if (!initialized) {
            donation.status = "failed";
            donation.provider = providers[0].id;
            donation.providerStatus = "initialization_failed";
            await donation.save();
            await recordAudit({
                action: "donation_initialization_failed",
                donation: donation._id,
                campaign: donation.campaign || null,
                actor: req.user?._id || null,
                metadata: { currency, amount: normalizedAmount },
            });
            const statusCode =
                lastError instanceof PaymentProviderError ? lastError.statusCode : 502;
            return res.status(statusCode).json({
                success: false,
                message:
                    lastError?.message ||
                    "The payment provider could not start this donation. Please try again.",
            });
        }

        donation.provider = initialized.provider;
        donation.providerReference = initialized.providerReference || reference;
        donation.providerStatus = initialized.providerStatus || "initialized";
        donation.authorizationUrl = initialized.authorizationUrl;
        await donation.save();

        await recordAudit({
            action: "donation_initialized",
            donation: donation._id,
            campaign: donation.campaign || null,
            actor: req.user?._id || null,
            metadata: {
                provider: initialized.provider,
                currency,
                amount: normalizedAmount,
            },
        });

        res.status(201).json({
            success: true,
            message: "Secure checkout created.",
            data: {
                donation: serializeDonation(donation),
                reference,
                authorizationUrl: initialized.authorizationUrl,
                provider: initialized.provider,
                providerLabel: providerLabel(initialized.provider),
                currency,
                amount: normalizedAmount,
                amountMinor,
            },
        });
    } catch (error) {
        console.error("Donation creation failed.", { name: error?.name || "Error" });
        if (donation && donation.status === "pending") {
            donation.status = "failed";
            donation.providerStatus = "server_error";
            await donation.save().catch(() => {});
        }
        res.status(500).json({
            success: false,
            message: "Your donation could not be started. Please try again.",
        });
    }
}

export async function verifyDonation(req, res) {
    try {
        const reference = text(req.body.reference, 120);
        if (!reference) {
            return res.status(400).json({
                success: false,
                message: "A payment reference is required.",
            });
        }

        const donation = await Donation.findOne({ paymentReference: reference }).populate(
            "campaign",
            "title slug currency"
        );
        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "No donation matches that reference.",
            });
        }

        if (donation.status === "successful" && donation.verifiedAt) {
            await ensureReceipt(donation);
            return res.json({
                success: true,
                message: "Donation verified.",
                data: serializeDonation(donation, { includeProvider: true }),
            });
        }

        const providerId =
            donation.provider || getProviderIdsForCurrency(donation.currency)[0] || null;
        if (!providerId) {
            return res.status(409).json({
                success: false,
                message:
                    "This donation cannot be verified online because no payment provider is configured for its currency.",
            });
        }

        let adapter;
        try {
            adapter = getAdapter(providerId);
        } catch (error) {
            return res.status(error.statusCode || 503).json({
                success: false,
                message: error.message || "The payment provider is not configured.",
            });
        }

        const result = await adapter.verifyDonation({
            reference: donation.providerReference || donation.paymentReference,
        });

        if (result.status === "successful") {
            if (!amountMatchesDonation(donation, result)) {
                await recordAudit({
                    action: "payment_amount_mismatch",
                    donation: donation._id,
                    campaign: donation.campaign || null,
                    metadata: {
                        expectedCurrency: donation.currency,
                        expectedAmount: donation.amount,
                        receivedCurrency: result.currency,
                        receivedAmountMinor: result.amountMinor,
                    },
                });
                return res.status(409).json({
                    success: false,
                    message:
                        "The payment provider returned an amount or currency that does not match this donation. Please contact the church office.",
                });
            }

            await markDonationSuccessful(donation, {
                paidAt: result.paidAt,
                providerStatus: result.providerStatus,
                verificationSource: "verify",
                providerReference: result.providerReference,
                providerTransactionId: result.providerTransactionId,
            });
        } else if (result.status === "failed") {
            donation.status = "failed";
            donation.providerStatus = result.providerStatus || "failed";
            await donation.save();
            await recordAudit({
                action: "donation_failed",
                donation: donation._id,
                campaign: donation.campaign || null,
                metadata: { providerStatus: donation.providerStatus },
            });
        } else {
            donation.providerStatus = result.providerStatus || "pending";
            await donation.save();
        }

        return res.json({
            success: true,
            message:
                donation.status === "successful"
                    ? "Donation verified."
                    : "Payment status checked.",
            data: serializeDonation(donation, { includeProvider: true }),
        });
    } catch (error) {
        if (error instanceof PaymentProviderError) {
            return res.status(error.statusCode || 502).json({
                success: false,
                message: error.message,
            });
        }
        console.error("Donation verification failed.", { name: error?.name || "Error" });
        return res.status(500).json({
            success: false,
            message: "We could not check the payment status right now. Please try again.",
        });
    }
}

export async function getMyDonations(req, res) {
    try {
        const email = String(req.user?.email || "").toLowerCase();
        const donations = await Donation.find({
            $or: [
                { userId: req.user._id },
                ...(email ? [{ email }] : []),
            ],
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .populate("campaign", "title slug currency");

        res.json({
            success: true,
            message: "Donation history fetched.",
            data: donations.map((donation) =>
                serializeDonation(donation, { includeDonor: true, includeProvider: true })
            ),
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Could not load your donation history.",
        });
    }
}

// ---------------------------------------------------------------------------
// Donation tracking (email one-time code)
// ---------------------------------------------------------------------------

export async function requestTracking(req, res) {
    const reference = text(req.body.reference, 120);
    const email = text(req.body.email, 254).toLowerCase();

    if (!reference || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Enter the donation reference and the email address used at checkout.",
        });
    }

    if (!isEmailConfigured()) {
        return res.status(503).json({
            success: false,
            message:
                "Donation receipt email is not configured on this server. Please contact the church office for a receipt.",
        });
    }

    const genericMessage =
        "If those details match a donation, a one-time verification code has been sent to the donor email.";

    try {
        const donation = await Donation.findOne({
            paymentReference: reference,
            email,
        }).select("+trackingCodeHash +trackingCodeExpiresAt");

        if (!donation) {
            return res.json({ success: true, message: genericMessage });
        }

        const code = String(crypto.randomInt(100000, 1000000));
        donation.trackingCodeHash = hashTrackingCode({ reference, email, code });
        donation.trackingCodeExpiresAt = new Date(
            Date.now() + TRACKING_CODE_TTL_MINUTES * 60 * 1000
        );
        donation.trackingAttempts = 0;
        await donation.save();

        const result = await sendTrackingCode({
            to: donation.email,
            reference: donation.paymentReference,
            code,
            expiresMinutes: TRACKING_CODE_TTL_MINUTES,
        });

        if (!result.sent) {
            donation.trackingCodeHash = "";
            donation.trackingCodeExpiresAt = null;
            await donation.save().catch(() => {});
            return res.status(502).json({
                success: false,
                message: "We could not send the verification code. Please try again later.",
            });
        }

        await recordAudit({
            action: "tracking_code_requested",
            donation: donation._id,
            campaign: donation.campaign || null,
            metadata: { messageId: result.id || null },
        });

        const payload = { success: true, message: genericMessage };
        if (
            process.env.DONATION_TRACKING_ECHO_CODE === "true" &&
            process.env.NODE_ENV !== "production"
        ) {
            payload.devCode = code;
        }
        return res.json(payload);
    } catch (error) {
        console.error("Tracking code request failed.", { name: error?.name || "Error" });
        return res.status(500).json({
            success: false,
            message: "We could not process that request right now. Please try again.",
        });
    }
}

export async function confirmTracking(req, res) {
    const reference = text(req.body.reference, 120);
    const email = text(req.body.email, 254).toLowerCase();
    const code = text(req.body.code, 10);

    if (!reference || !EMAIL_PATTERN.test(email) || !/^\d{6}$/.test(code)) {
        return res.status(400).json({
            success: false,
            message: "Enter the reference, email address, and the six-digit code.",
        });
    }

    try {
        const donation = await Donation.findOne({ paymentReference: reference, email })
            .select("+trackingCodeHash +trackingCodeExpiresAt")
            .populate("campaign", "title slug currency");

        const invalidMessage = "That verification code is invalid or has expired.";
        if (!donation) {
            return res.status(400).json({ success: false, message: invalidMessage });
        }
        if (Number(donation.trackingAttempts || 0) >= MAX_TRACKING_ATTEMPTS) {
            return res.status(429).json({
                success: false,
                message: "Too many incorrect codes. Request a new code and try again.",
            });
        }
        if (
            !donation.trackingCodeHash ||
            !donation.trackingCodeExpiresAt ||
            new Date(donation.trackingCodeExpiresAt).getTime() < Date.now()
        ) {
            return res.status(400).json({ success: false, message: invalidMessage });
        }

        const expected = hashTrackingCode({ reference, email, code });
        if (!safeEqualHex(expected, donation.trackingCodeHash)) {
            donation.trackingAttempts = Number(donation.trackingAttempts || 0) + 1;
            await donation.save();
            return res.status(400).json({ success: false, message: invalidMessage });
        }

        donation.trackingCodeHash = "";
        donation.trackingCodeExpiresAt = null;
        donation.trackingAttempts = 0;
        await donation.save();
        await recordAudit({
            action: "tracking_verified",
            donation: donation._id,
            campaign: donation.campaign || null,
        });

        return res.json({
            success: true,
            message: "Donation record retrieved.",
            data: serializeDonation(donation, { includeDonor: true, includeProvider: true }),
        });
    } catch (error) {
        console.error("Tracking verification failed.", { name: error?.name || "Error" });
        return res.status(500).json({
            success: false,
            message: "We could not verify that code right now. Please try again.",
        });
    }
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

export async function paystackWebhook(req, res) {
    try {
        const signature = req.headers["x-paystack-signature"];
        const adapter = getAdapter("paystack");
        if (!adapter.verifyWebhookSignature(req.body, signature)) {
            return res.status(401).json({ success: false, message: "Invalid webhook signature." });
        }

        const event = JSON.parse(Buffer.isBuffer(req.body) ? req.body.toString("utf8") : req.body);
        if (!event?.event || !event?.data) {
            return res.status(200).json({ received: true });
        }

        const reference = event.data.reference;
        if (!reference) return res.status(200).json({ received: true });

        const donation = await Donation.findOne({
            $or: [{ paymentReference: reference }, { providerReference: reference }],
        });
        if (!donation) return res.status(200).json({ received: true });

        if (event.event === "charge.success") {
            if (!amountMatchesDonation(donation, {
                amountMinor: event.data.amount,
                currency: event.data.currency,
            })) {
                await recordAudit({
                    action: "payment_amount_mismatch",
                    donation: donation._id,
                    campaign: donation.campaign || null,
                    metadata: {
                        source: "paystack_webhook",
                        expectedCurrency: donation.currency,
                        expectedAmount: donation.amount,
                        receivedCurrency: event.data.currency,
                        receivedAmountMinor: event.data.amount,
                    },
                });
                return res.status(200).json({ received: true });
            }

            await markDonationSuccessful(donation, {
                paidAt: event.data.paid_at ? new Date(event.data.paid_at) : new Date(),
                providerStatus: "success",
                verificationSource: "webhook",
                providerReference: event.data.reference,
                providerTransactionId: event.data.id ? String(event.data.id) : "",
            });
        } else if (event.event === "charge.failed") {
            if (donation.status !== "successful") {
                donation.status = "failed";
                donation.providerStatus = "failed";
                await donation.save();
                await recordAudit({
                    action: "donation_failed",
                    donation: donation._id,
                    campaign: donation.campaign || null,
                    metadata: { source: "paystack_webhook" },
                });
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Paystack webhook failed.", { name: error?.name || "Error" });
        return res.status(500).json({ success: false, message: "Webhook could not be processed." });
    }
}

export async function paypalWebhook(req, res) {
    try {
        const adapter = getAdapter("paypal");
        const verified = await adapter.verifyWebhookSignature({
            headers: req.headers,
            rawBody: req.body,
        });
        if (!verified) {
            return res.status(401).json({ success: false, message: "Invalid webhook signature." });
        }

        const event = adapter.parseWebhookEvent(req.body);
        if (!event?.event_type) return res.status(200).json({ received: true });

        const resource = event.resource || {};
        const orderId = resource.supplementary_data?.related_ids?.order_id;
        const customId = resource.custom_id;
        if (!orderId && !customId) return res.status(200).json({ received: true });

        const donation = await Donation.findOne({
            $or: [
                ...(orderId ? [{ providerReference: orderId }] : []),
                ...(customId ? [{ paymentReference: customId }] : []),
            ],
        });
        if (!donation) return res.status(200).json({ received: true });

        if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
            if (!amountMatchesDonation(donation, {
                amountMinor: resource.amount?.value
                    ? Math.round(Number(resource.amount.value) * 100)
                    : NaN,
                currency: resource.amount?.currency_code,
            })) {
                await recordAudit({
                    action: "payment_amount_mismatch",
                    donation: donation._id,
                    campaign: donation.campaign || null,
                    metadata: {
                        source: "paypal_webhook",
                        expectedCurrency: donation.currency,
                        expectedAmount: donation.amount,
                        receivedCurrency: resource.amount?.currency_code,
                        receivedAmount: resource.amount?.value,
                    },
                });
                return res.status(200).json({ received: true });
            }

            await markDonationSuccessful(donation, {
                paidAt: resource.create_time ? new Date(resource.create_time) : new Date(),
                providerStatus: "completed",
                verificationSource: "webhook",
                providerReference: orderId,
                providerTransactionId: resource.id ? String(resource.id) : "",
            });
        } else if (["PAYMENT.CAPTURE.DENIED", "PAYMENT.CAPTURE.FAILED"].includes(event.event_type)) {
            donation.status = "failed";
            donation.providerStatus = "failed";
            await donation.save();
            await recordAudit({
                action: "donation_failed",
                donation: donation._id,
                campaign: donation.campaign || null,
                metadata: { source: "paypal_webhook" },
            });
        } else if (event.event_type === "PAYMENT.CAPTURE.REFUNDED") {
            donation.status = "refunded";
            donation.providerStatus = "refunded";
            await donation.save();
            await recordAudit({
                action: "donation_refunded",
                donation: donation._id,
                campaign: donation.campaign || null,
                metadata: { source: "paypal_webhook" },
            });
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        if (error instanceof PaymentProviderError) {
            return res.status(error.statusCode || 502).json({
                success: false,
                message: error.message,
            });
        }
        console.error("PayPal webhook failed.", { name: error?.name || "Error" });
        return res.status(500).json({ success: false, message: "Webhook could not be processed." });
    }
}
