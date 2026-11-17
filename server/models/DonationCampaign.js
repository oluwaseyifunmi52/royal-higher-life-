import mongoose from "mongoose";
import { CURRENCY_DEFINITIONS } from "../config/donationCurrencies.js";

const donationCampaignSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 140,
        },
        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: 4000,
        },
        targetAmount: {
            type: Number,
            required: true,
            min: 1,
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            enum: Object.keys(CURRENCY_DEFINITIONS),
            default: "NGN",
        },
        coverImage: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const DonationCampaign = mongoose.model("DonationCampaign", donationCampaignSchema);
export default DonationCampaign;
