import mongoose from "mongoose";

const partnershipSchema = new mongoose.Schema({
  organization: {
    type: String,
    required: true,
  },
  contactName: {
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
  partnershipType: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Partnership = mongoose.model("Partnership", partnershipSchema);
export default Partnership;
