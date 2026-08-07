import mongoose from "mongoose";

const ministrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  leader: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  contactEmail: {
    type: String,
    default: "",
    lowercase: true,
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

const Ministry = mongoose.model("Ministry", ministrySchema);
export default Ministry;
