import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
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
  skills: {
    type: String,
    default: "",
  },
  availability: {
    type: String,
    default: "",
  },
  motivation: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;
