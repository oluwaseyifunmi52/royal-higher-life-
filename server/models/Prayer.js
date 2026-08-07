import mongoose from "mongoose";

const prayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
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
    default: "general",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prayer = mongoose.model("Prayer", prayerSchema);
export default Prayer;
