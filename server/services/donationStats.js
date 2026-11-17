import Donation from "../models/Donation.js";

export const VERIFIED_DONATION_STATUSES = ["successful", "completed"];

/**
 * Campaign totals are grouped by currency. We never add different currencies
 * together or convert them using an invented exchange rate.
 */
export async function getCampaignRaisedTotals(campaignIds = null) {
    const match = {
        campaign: campaignIds ? { $in: campaignIds } : { $ne: null },
        status: { $in: VERIFIED_DONATION_STATUSES },
    };

    const rows = await Donation.aggregate([
        { $match: match },
        {
            $group: {
                _id: { campaign: "$campaign", currency: "$currency" },
                amount: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
    ]);

    const totals = new Map();
    for (const row of rows) {
        const campaignId = String(row._id.campaign);
        const currency = String(row._id.currency || "NGN").toUpperCase();
        const current = totals.get(campaignId) || {
            raisedByCurrency: {},
            donationCount: 0,
        };
        current.raisedByCurrency[currency] = Number(row.amount || 0);
        current.donationCount += Number(row.count || 0);
        totals.set(campaignId, current);
    }
    return totals;
}

export function describeCampaign(campaign, totals) {
    const id = String(campaign._id || campaign.id);
    const aggregate = totals.get(id) || { raisedByCurrency: {}, donationCount: 0 };
    const currency = String(campaign.currency || "NGN").toUpperCase();
    const raisedAmount = Number(aggregate.raisedByCurrency[currency] || 0);
    const targetAmount = Number(campaign.targetAmount || 0);
    const progressPercent =
        targetAmount > 0 ? Math.min(100, Math.round((raisedAmount / targetAmount) * 100)) : 0;

    return {
        id,
        _id: campaign._id,
        title: campaign.title,
        slug: campaign.slug,
        description: campaign.description,
        targetAmount,
        currency,
        coverImage: campaign.coverImage || "",
        isActive: campaign.isActive !== false,
        raisedAmount,
        raisedByCurrency: aggregate.raisedByCurrency,
        donationCount: aggregate.donationCount,
        progressPercent,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
    };
}

export async function getVerifiedTotals({ from } = {}) {
    const match = { status: { $in: VERIFIED_DONATION_STATUSES } };
    if (from) match.createdAt = { $gte: from };

    const rows = await Donation.aggregate([
        { $match: match },
        {
            $group: {
                _id: { currency: "$currency" },
                amount: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.currency": 1 } },
    ]);

    return rows.map((row) => ({
        currency: String(row._id.currency || "NGN").toUpperCase(),
        amount: Number(row.amount || 0),
        count: Number(row.count || 0),
    }));
}
