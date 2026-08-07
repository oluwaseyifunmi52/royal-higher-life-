import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "NGN",
  },
  purpose: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
