import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
        },
        phone: {
            type: String,
            default: "",
            trim: true,
            maxlength: 40,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        amountMinor: {
            type: Number,
            min: 0,
            default: null,
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
            default: "NGN",
        },
        provider: {
            type: String,
            enum: ["paystack", "paypal"],
            default: undefined,
        },
        providerReference: {
            type: String,
            default: "",
            trim: true,
        },
        providerStatus: {
            type: String,
            default: "",
            trim: true,
        },
        paymentReference: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        authorizationUrl: {
            type: String,
            default: "",
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "successful", "failed", "abandoned", "refunded", "completed"],
            default: "pending",
            index: true,
        },
        verifiedAt: {
            type: Date,
            default: null,
        },
        paidAt: {
            type: Date,
            default: null,
        },
        verificationSource: {
            type: String,
            enum: ["verify", "webhook", "admin"],
            default: undefined,
        },
        purpose: {
            type: String,
            default: "",
            trim: true,
            maxlength: 120,
        },
        message: {
            type: String,
            default: "",
            trim: true,
            maxlength: 2000,
        },
        anonymous: {
            type: Boolean,
            default: false,
        },
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DonationCampaign",
            default: null,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },
        receiptNumber: {
            type: String,
            default: "",
            trim: true,
        },
        receiptSentAt: {
            type: Date,
            default: null,
        },
        receiptError: {
            type: String,
            default: "",
        },
        trackingCodeHash: {
            type: String,
            default: "",
            select: false,
        },
        trackingCodeExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },
        trackingAttempts: {
            type: Number,
            default: 0,
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
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

donationSchema.index({ email: 1, createdAt: -1 });
donationSchema.index({ campaign: 1, status: 1, currency: 1 });
donationSchema.index({ provider: 1, providerReference: 1 });

donationSchema.virtual("donorName").get(function donorName() {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

donationSchema.virtual("donationType").get(function donationType() {
    return this.purpose || "General Offering";
});

donationSchema.virtual("isAnonymous").get(function isAnonymous() {
    return Boolean(this.anonymous);
});

donationSchema.pre("save", function updateTimestamp(next) {
    this.updatedAt = new Date();
    next();
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
