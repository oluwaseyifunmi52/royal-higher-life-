import mongoose from "mongoose";

const prayerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  prayer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General Prayer",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "prayed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prayer = mongoose.model("Prayer", prayerSchema);
export default Prayer;
