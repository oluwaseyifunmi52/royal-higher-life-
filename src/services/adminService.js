import api from "../api/axios";
import { invalidatePublicSiteContentCache } from "./publicContentService";

// Dashboard
export const getDashboardStats = () =>
    api.get("/api/admin/stats");

// Sermons
export const getSermons = () =>
    api.get("/api/sermons/admin/all");

export const createSermon = (data) =>
    api.post("/api/sermons", data);

export const updateSermon = (id, data) =>
    api.put(`/api/sermons/${id}`, data);

export const deleteSermon = (id) =>
    api.delete(`/api/sermons/${id}`);

// Events
export const getAdminEvents = () =>
    api.get("/api/events/admin/all");

export const createEvent = (data) =>
    api.post("/api/events", data);

export const updateEvent = (id, data) =>
    api.put(`/api/events/${id}`, data);

export const deleteEvent = (id) =>
    api.delete(`/api/events/${id}`);

// Ministries
export const getMinistries = () =>
    api.get("/api/ministries");

export const createMinistry = (data) =>
    api.post("/api/ministries", data);

export const updateMinistry = (id, data) => api.put(`/api/ministries/${id}`, data);

export const deleteMinistry = (id) =>
    api.delete(`/api/ministries/${id}`);

// Gallery
export const getGalleryImages = () =>
    api.get("/api/gallery/admin/all");

export const uploadGalleryImage = (data, onUploadProgress) =>
    api.post("/api/gallery", data, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });

export const updateGalleryImage = (id, data, onUploadProgress) =>
    api.put(`/api/gallery/${id}`, data, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });

export const deleteGalleryImage = (id) =>
    api.delete(`/api/gallery/${id}`);

// Announcements
export const getAnnouncements = () =>
    api.get("/api/announcements/admin/all");

export const createAnnouncement = (data) =>
    api.post("/api/announcements", data);

export const updateAnnouncement = (id, data) => api.put(`/api/announcements/${id}`, data);

export const deleteAnnouncement = (id) =>
    api.delete(`/api/announcements/${id}`);

// Testimonies
export const getTestimonies = () =>
    api.get("/api/reviews/admin/all");

export const updateTestimony = (id, data) =>
    api.put(`/api/reviews/${id}`, data);

export const deleteTestimony = (id) =>
    api.delete(`/api/reviews/${id}`);

// Prayer Requests
export const getPrayerRequests = () =>
    api.get("/api/prayers");

export const updatePrayerRequest = (id, data) =>
    api.put(`/api/prayers/${id}`, data);

export const deletePrayerRequest = (id) =>
    api.delete(`/api/prayers/${id}`);

// Contact Messages
export const getContactMessages = () =>
    api.get("/api/contacts");

export const updateContactMessage = (id, data) =>
    api.put(`/api/contacts/${id}`, data);

export const retryContactNotification = (id) =>
    api.post(`/api/contacts/${id}/retry-notification`);

export const deleteContactMessage = (id) =>
    api.delete(`/api/contacts/${id}`);

// Leadership
export const getLeadership = () =>
    api.get("/api/leadership/admin/all");

export const createLeadership = (data) =>
    api.post("/api/leadership", data);

export const updateLeadership = (id, data) =>
    api.put(`/api/leadership/${id}`, data);

export const deleteLeadership = (id) =>
    api.delete(`/api/leadership/${id}`);

// Donations
export const getDonations = (params = {}) =>
    api.get("/api/admin/donations", { params });
export const createDonationCampaign = (data) => api.post("/api/admin/donations/campaigns", data);
export const updateDonationCampaign = (id, data) => api.put(`/api/admin/donations/campaigns/${id}`, data);
export const deactivateDonationCampaign = (id) => api.delete(`/api/admin/donations/campaigns/${id}`);
export const getDonationCampaigns = () => api.get("/api/admin/donations/campaigns");
export const getDonationAudit = () => api.get("/api/admin/donations/audit");
export const resendDonationReceipt = (id) => api.post(`/api/admin/donations/${id}/resend-receipt`);

// Users
export const getUsers = () =>
    api.get("/api/users");

// Contacts
export const getContacts = () =>
    api.get("/api/contacts");

export const getVolunteerApplications = () => api.get("/api/volunteers");
export const getPartnershipApplications = () => api.get("/api/partnerships");
export const getNewsletterSubscribers = () => api.get("/api/newsletter");
export const getEventRegistrations = () => api.get("/api/event-registrations");
export const getAdminSiteContent = () => api.get("/api/site-content/admin");
export const saveAdminSiteContent = async (content, publish) => {
  const response = await api.put("/api/site-content", { content, publish });
  if (publish) invalidatePublicSiteContentCache();
  return response;
};
export const getAdminUsers = (params) => api.get("/api/admin/administrators", { params });
export const createAdminUser = (data) => api.post("/api/admin/administrators", data);
export const updateAdminDetails = (id, data) => api.put(`/api/admin/administrators/${id}/details`, data);
export const updateAdminUserRole = (id, role) => api.put(`/api/admin/administrators/${id}/role`, { role });
export const suspendAdminUser = (id) => api.put(`/api/admin/administrators/${id}/suspend`);
export const reactivateAdminUser = (id) => api.put(`/api/admin/administrators/${id}/reactivate`);
export const revokeAdminUser = (id) => api.delete(`/api/admin/administrators/${id}`);
export const getAdminAuditLog = () => api.get("/api/admin/audit");
