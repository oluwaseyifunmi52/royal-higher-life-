import mongoose from "mongoose";

const donationAuditSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
            index: true,
        },
        donation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donation",
            default: null,
        },
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DonationCampaign",
            default: null,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const DonationAudit = mongoose.model("DonationAudit", donationAuditSchema);
export default DonationAudit;
