import { Router } from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getSermons,
  createSermon,
  updateSermon,
  deleteSermon,
  getAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getMinistries,
  createMinistry,
  deleteMinistry,
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getDashboardStats,
  getDonations,
  getUsers,
  getContacts,
} from "../controllers/adminController.js";

const router = Router();

router.use(adminAuth);

// Dashboard
router.get("/stats", getDashboardStats);

// Sermons
router.get("/sermons", getSermons);
router.post("/sermons", createSermon);
router.put("/sermons/:id", updateSermon);
router.delete("/sermons/:id", deleteSermon);

// Events
router.get("/events", getAdminEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Ministries
router.get("/ministries", getMinistries);
router.post("/ministries", createMinistry);
router.delete("/ministries/:id", deleteMinistry);

// Gallery
router.get("/gallery", getGalleryImages);
router.post("/gallery", uploadGalleryImage);
router.delete("/gallery/:id", deleteGalleryImage);

// Announcements
router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

// Donations
router.get("/donations", getDonations);

// Users
router.get("/users", getUsers);

// Contacts
router.get("/contacts", getContacts);

export default router;
