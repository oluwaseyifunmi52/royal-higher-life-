import mongoose from "mongoose";

const leadershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  isPastor: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Leadership = mongoose.model("Leadership", leadershipSchema);
export default Leadership;