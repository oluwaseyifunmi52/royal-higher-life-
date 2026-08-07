import Sermon from "../models/Sermon.js";
import Event from "../models/Event.js";
import Ministry from "../models/Ministry.js";
import Gallery from "../models/Gallery.js";
import Announcement from "../models/Announcement.js";
import Donation from "../models/Donation.js";
import User from "../models/User.js";
import Contact from "../models/Contact.js";

// ==================== Sermon CRUD ====================

export const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.json({ success: true, message: "Sermons fetched.", data: sermons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch sermons." });
  }
};

export const createSermon = async (req, res) => {
  try {
    const { title, speaker, date } = req.body;
    if (!title || !speaker || !date) {
      return res.status(400).json({ success: false, message: "Title, speaker, and date are required." });
    }
    const sermon = await Sermon.create(req.body);
    res.status(201).json({ success: true, message: "Sermon created.", data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create sermon." });
  }
};

export const updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sermon) {
      return res.status(404).json({ success: false, message: "Sermon not found." });
    }
    res.json({ success: true, message: "Sermon updated.", data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update sermon." });
  }
};

export const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: "Sermon not found." });
    }
    res.json({ success: true, message: "Sermon deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete sermon." });
  }
};

// ==================== Event CRUD ====================

export const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ success: true, message: "Events fetched.", data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch events." });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, date, location } = req.body;
    if (!title || !date || !location) {
      return res.status(400).json({ success: false, message: "Title, date, and location are required." });
    }
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, message: "Event created.", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    res.json({ success: true, message: "Event updated.", data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update event." });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    res.json({ success: true, message: "Event deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete event." });
  }
};

// ==================== Ministry ====================

export const getMinistries = async (req, res) => {
  try {
    const ministries = await Ministry.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Ministries fetched.", data: ministries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch ministries." });
  }
};

export const createMinistry = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Ministry name is required." });
    }
    const ministry = await Ministry.create(req.body);
    res.status(201).json({ success: true, message: "Ministry created.", data: ministry });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create ministry." });
  }
};

export const deleteMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findByIdAndDelete(req.params.id);
    if (!ministry) {
      return res.status(404).json({ success: false, message: "Ministry not found." });
    }
    res.json({ success: true, message: "Ministry deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete ministry." });
  }
};

// ==================== Gallery ====================

export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Gallery images fetched.", data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch gallery images." });
  }
};

export const uploadGalleryImage = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, message: "Title and imageUrl are required." });
    }
    const image = await Gallery.create({ ...req.body, uploadedBy: req.user._id });
    res.status(201).json({ success: true, message: "Image uploaded.", data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to upload image." });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }
    res.json({ success: true, message: "Image deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete image." });
  }
};

// ==================== Announcements ====================

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json({ success: true, message: "Announcements fetched.", data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch announcements." });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }
    const announcement = await Announcement.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, message: "Announcement created.", data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create announcement." });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found." });
    }
    res.json({ success: true, message: "Announcement deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete announcement." });
  }
};

// ==================== Dashboard Stats ====================

export const getDashboardStats = async (req, res) => {
  try {
    const [users, donations, events, contacts] = await Promise.all([
      User.countDocuments(),
      Donation.countDocuments(),
      Event.countDocuments(),
      Contact.countDocuments(),
    ]);
    res.json({
      success: true,
      message: "Stats fetched.",
      data: { users, donations, events, contacts },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};

// ==================== Donations ====================

export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Donations fetched.", data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch donations." });
  }
};

// ==================== Users ====================

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, message: "Users fetched.", data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

// ==================== Contacts ====================

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, message: "Contacts fetched.", data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch contacts." });
  }
};
