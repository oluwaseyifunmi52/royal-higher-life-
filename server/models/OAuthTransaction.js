import mongoose from "mongoose";

const oauthTransactionSchema = new mongoose.Schema(
    {
        purpose: {
            type: String,
            enum: ["state", "exchange"],
            required: true,
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true,
            select: false,
        },
        provider: {
            type: String,
            enum: ["google", "facebook"],
            required: true,
        },
        nonce: { type: String, select: false },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: function userRequired() { return this.purpose === "exchange"; },
        },
        expiresAt: {
            type: Date,
            required: true,
            expires: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("OAuthTransaction", oauthTransactionSchema);
