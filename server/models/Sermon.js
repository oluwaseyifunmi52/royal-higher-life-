import mongoose from "mongoose";

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  speaker: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  scripture: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    required: true,
  },
  videoUrl: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
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

const Sermon = mongoose.model("Sermon", sermonSchema);
export default Sermon;
