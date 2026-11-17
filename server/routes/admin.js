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
  getUsers,
  getContacts,
  getTestimonies,
  updateTestimony,
  deleteTestimony,
  getPrayerRequests,
  updatePrayerRequest,
  deletePrayerRequest,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
  getLeadership,
  createLeadership,
  updateLeadership,
  deleteLeadership,
} from "../controllers/adminController.js";
import {
  adminCreateCampaign,
  adminDeactivateCampaign,
  adminGetAudit,
  adminListCampaigns,
  adminListDonations,
  adminResendReceipt,
  adminUpdateCampaign,
} from "../controllers/adminDonationController.js";

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

// Testimonies
router.get("/testimonies", getTestimonies);
router.put("/testimonies/:id", updateTestimony);
router.delete("/testimonies/:id", deleteTestimony);

// Prayer Requests
router.get("/prayer-requests", getPrayerRequests);
router.put("/prayer-requests/:id", updatePrayerRequest);
router.delete("/prayer-requests/:id", deletePrayerRequest);

// Contact Messages
router.get("/contact-messages", getContactMessages);
router.put("/contact-messages/:id", updateContactMessage);
router.delete("/contact-messages/:id", deleteContactMessage);

// Leadership
router.get("/leadership", getLeadership);
router.post("/leadership", createLeadership);
router.put("/leadership/:id", updateLeadership);
router.delete("/leadership/:id", deleteLeadership);

// Donations & campaigns
router.get("/donations", adminListDonations);
router.get("/donations/campaigns", adminListCampaigns);
router.post("/donations/campaigns", adminCreateCampaign);
router.put("/donations/campaigns/:id", adminUpdateCampaign);
router.delete("/donations/campaigns/:id", adminDeactivateCampaign);
router.get("/donations/audit", adminGetAudit);
router.post("/donations/:id/resend-receipt", adminResendReceipt);

// Users
router.get("/users", getUsers);

// Contacts
router.get("/contacts", getContacts);

export default router;
