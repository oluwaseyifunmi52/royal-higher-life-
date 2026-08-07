import mongoose from "mongoose";

const testimonySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  title: {
    type: String,
    default: "",
  },
  testimony: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimony = mongoose.model("Testimony", testimonySchema);
export default Testimony;
