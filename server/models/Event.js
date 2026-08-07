import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  capacity: {
    type: Number,
    default: 0,
  },
  registrations: {
    type: Number,
    default: 0,
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

const Event = mongoose.model("Event", eventSchema);
export default Event;
