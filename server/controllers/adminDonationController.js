import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import DonationCampaign from "../models/DonationCampaign.js";
import DonationAudit from "../models/DonationAudit.js";
import { isKnownCurrency } from "../config/donationCurrencies.js";
import { isEmailConfigured, sendDonationReceipt } from "../services/emailService.js";
import {
    describeCampaign,
    getCampaignRaisedTotals,
    VERIFIED_DONATION_STATUSES,
} from "../services/donationStats.js";
import { serializeDonation } from "./donationController.js";

const ALLOWED_STATUSES = [
    "pending",
    "processing",
    "successful",
    "failed",
    "abandoned",
    "refunded",
    "completed",
];
const ALLOWED_PROVIDERS = ["paystack", "paypal"];

function text(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 140);
}

function parseTargetAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    if (Math.abs(Math.round(amount * 100) / 100 - amount) > 1e-9) return null;
    return amount;
}

function campaignPayload(body) {
    const payload = {};
    if (body.title !== undefined) payload.title = text(body.title, 120);
    if (body.description !== undefined) payload.description = text(body.description, 4000);
    if (body.slug !== undefined) payload.slug = slugify(body.slug);
    if (body.currency !== undefined) payload.currency = text(body.currency, 3).toUpperCase();
    if (body.coverImage !== undefined) payload.coverImage = text(body.coverImage, 500);
    if (body.isActive !== undefined) payload.isActive = body.isActive === true;
    if (body.targetAmount !== undefined) {
        const amount = parseTargetAmount(body.targetAmount);
        if (amount === null) return { error: "Enter a valid campaign target amount." };
        payload.targetAmount = amount;
    }
    return { payload };
}

async function writeAudit({ action, donation, campaign, actor, metadata = {} }) {
    try {
        await DonationAudit.create({ action, donation, campaign, actor, metadata });
    } catch (error) {
        console.warn("Could not write donation audit event.", {
            action,
            name: error?.name || "Error",
        });
    }
}

export async function adminListDonations(req, res) {
    try {
        const {
            status,
            currency,
            provider,
            search,
            page: pageQuery,
            limit: limitQuery,
        } = req.query;

        const filter = {};
        if (status && ALLOWED_STATUSES.includes(String(status))) filter.status = String(status);
        if (currency && isKnownCurrency(currency)) {
            filter.currency = String(currency).toUpperCase();
        }
        if (provider && ALLOWED_PROVIDERS.includes(String(provider))) {
            filter.provider = String(provider);
        }
        const searchTerm = text(search, 120);
        if (searchTerm) {
            const matcher = new RegExp(escapeRegex(searchTerm), "i");
            filter.$or = [
                { paymentReference: matcher },
                { providerReference: matcher },
                { receiptNumber: matcher },
                { email: matcher },
                { firstName: matcher },
                { lastName: matcher },
            ];
        }

        const page = Math.max(1, Number.parseInt(pageQuery, 10) || 1);
        const limit = Math.min(200, Math.max(1, Number.parseInt(limitQuery, 10) || 50));

        const [donations, total] = await Promise.all([
            Donation.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("campaign", "title slug currency"),
            Donation.countDocuments(filter),
        ]);

        res.json({
            success: true,
            message: "Donations fetched.",
            data: {
                donations: donations.map((donation) =>
                    serializeDonation(donation, { includeDonor: true, includeProvider: true })
                ),
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.max(1, Math.ceil(total / limit)),
                },
            },
        });
    } catch {
        res.status(500).json({ success: false, message: "Failed to fetch donations." });
    }
}

export async function adminListCampaigns(_req, res) {
    try {
        const campaigns = await DonationCampaign.find().sort({ createdAt: -1 }).lean();
        const totals = await getCampaignRaisedTotals(campaigns.map((campaign) => campaign._id));
        res.json({
            success: true,
            message: "Campaigns fetched.",
            data: campaigns.map((campaign) => ({
                ...describeCampaign(campaign, totals),
                createdBy: campaign.createdBy || null,
            })),
        });
    } catch {
        res.status(500).json({ success: false, message: "Failed to fetch campaigns." });
    }
}

export async function adminCreateCampaign(req, res) {
    try {
        const { payload, error } = campaignPayload(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        const title = payload.title || "";
        if (!title) {
            return res.status(400).json({ success: false, message: "Campaign title is required." });
        }
        const slug = payload.slug || slugify(title);
        if (!slug) {
            return res.status(400).json({ success: false, message: "A valid campaign slug is required." });
        }
        const currency = payload.currency || "NGN";
        if (!isKnownCurrency(currency)) {
            return res.status(400).json({ success: false, message: "Choose a supported campaign currency." });
        }
        const targetAmount = payload.targetAmount;
        if (targetAmount === undefined) {
            return res.status(400).json({ success: false, message: "Campaign target amount is required." });
        }

        const existing = await DonationCampaign.findOne({ slug });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "That campaign slug is already in use. Choose another one.",
            });
        }

        const campaign = await DonationCampaign.create({
            title,
            slug,
            description: payload.description || "",
            targetAmount,
            currency,
            coverImage: payload.coverImage || "",
            isActive: payload.isActive ?? true,
            createdBy: req.user?._id || null,
        });

        await writeAudit({
            action: "campaign_created",
            campaign: campaign._id,
            actor: req.user?._id || null,
            metadata: { title: campaign.title, currency: campaign.currency },
        });

        const totals = await getCampaignRaisedTotals([campaign._id]);
        res.status(201).json({
            success: true,
            message: "Campaign created.",
            data: describeCampaign(campaign.toObject(), totals),
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "That campaign slug is already in use. Choose another one.",
            });
        }
        res.status(500).json({ success: false, message: "Failed to create the campaign." });
    }
}

export async function adminUpdateCampaign(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid campaign id." });
        }
        const campaign = await DonationCampaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found." });
        }

        const { payload, error } = campaignPayload(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        if (payload.title !== undefined) {
            if (!payload.title) {
                return res.status(400).json({ success: false, message: "Campaign title is required." });
            }
            campaign.title = payload.title;
        }
        if (payload.slug !== undefined && payload.slug) campaign.slug = payload.slug;
        if (payload.description !== undefined) campaign.description = payload.description;
        if (payload.coverImage !== undefined) campaign.coverImage = payload.coverImage;
        if (payload.isActive !== undefined) campaign.isActive = payload.isActive;

        if (payload.currency !== undefined && payload.currency !== campaign.currency) {
            if (!isKnownCurrency(payload.currency)) {
                return res.status(400).json({
                    success: false,
                    message: "Choose a supported campaign currency.",
                });
            }
            const recordedDonations = await Donation.countDocuments({ campaign: campaign._id });
            if (recordedDonations > 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "The campaign currency cannot be changed after donations have been recorded. Create a new campaign instead.",
                });
            }
            campaign.currency = payload.currency;
            campaign.targetAmount = payload.targetAmount ?? campaign.targetAmount;
        } else if (payload.targetAmount !== undefined) {
            campaign.targetAmount = payload.targetAmount;
        }

        await campaign.save();

        await writeAudit({
            action: "campaign_updated",
            campaign: campaign._id,
            actor: req.user?._id || null,
            metadata: { title: campaign.title, currency: campaign.currency },
        });

        const totals = await getCampaignRaisedTotals([campaign._id]);
        res.json({
            success: true,
            message: "Campaign updated.",
            data: describeCampaign(campaign.toObject(), totals),
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "That campaign slug is already in use. Choose another one.",
            });
        }
        res.status(500).json({ success: false, message: "Failed to update the campaign." });
    }
}

export async function adminDeactivateCampaign(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid campaign id." });
        }
        const campaign = await DonationCampaign.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found." });
        }
        await writeAudit({
            action: "campaign_deactivated",
            campaign: campaign._id,
            actor: req.user?._id || null,
            metadata: { title: campaign.title },
        });
        res.json({
            success: true,
            message: "Campaign deactivated. Existing donation records were retained.",
            data: { id: campaign._id, isActive: campaign.isActive },
        });
    } catch {
        res.status(500).json({ success: false, message: "Failed to deactivate the campaign." });
    }
}

export async function adminGetAudit(req, res) {
    try {
        const entries = await DonationAudit.find()
            .sort({ createdAt: -1 })
            .limit(200)
            .populate("donation", "paymentReference amount currency status")
            .populate("campaign", "title currency")
            .populate("actor", "firstName lastName email")
            .lean();
        res.json({ success: true, message: "Donation audit log fetched.", data: entries });
    } catch {
        res.status(500).json({ success: false, message: "Failed to fetch the donation audit log." });
    }
}

export async function adminResendReceipt(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid donation id." });
        }
        if (!isEmailConfigured()) {
            return res.status(503).json({
                success: false,
                message: "Donation receipt email is not configured on this server.",
            });
        }

        const donation = await Donation.findById(req.params.id).populate(
            "campaign",
            "title slug currency"
        );
        if (!donation) {
            return res.status(404).json({ success: false, message: "Donation not found." });
        }
        if (!VERIFIED_DONATION_STATUSES.includes(donation.status)) {
            return res.status(400).json({
                success: false,
                message: "Receipts can only be sent for verified donations.",
            });
        }

        const result = await sendDonationReceipt({
            donation,
            campaign: donation.campaign,
        });
        if (!result.sent) {
            donation.receiptError = result.reason || "receipt_not_sent";
            await donation.save();
            return res.status(502).json({
                success: false,
                message: "The receipt email could not be sent. Please try again later.",
            });
        }

        donation.receiptSentAt = new Date();
        donation.receiptError = "";
        await donation.save();
        await writeAudit({
            action: "receipt_resent",
            donation: donation._id,
            campaign: donation.campaign?._id || null,
            actor: req.user?._id || null,
            metadata: { messageId: result.id || null },
        });

        res.json({ success: true, message: "Receipt email sent." });
    } catch {
        res.status(500).json({ success: false, message: "Failed to resend the receipt." });
    }
}

export { ALLOWED_STATUSES, ALLOWED_PROVIDERS };
