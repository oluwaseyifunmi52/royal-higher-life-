import api from "../api/axios";

// Dashboard
export const getDashboardStats = () =>
    api.get("/api/admin/stats");

// Sermons
export const getSermons = () =>
    api.get("/api/admin/sermons");

export const createSermon = (data) =>
    api.post("/api/admin/sermons", data);

export const updateSermon = (id, data) =>
    api.put(`/api/admin/sermons/${id}`, data);

export const deleteSermon = (id) =>
    api.delete(`/api/admin/sermons/${id}`);

// Events
export const getAdminEvents = () =>
    api.get("/api/admin/events");

export const createEvent = (data) =>
    api.post("/api/admin/events", data);

export const updateEvent = (id, data) =>
    api.put(`/api/admin/events/${id}`, data);

export const deleteEvent = (id) =>
    api.delete(`/api/admin/events/${id}`);

// Ministries
export const getMinistries = () =>
    api.get("/api/admin/ministries");

export const createMinistry = (data) =>
    api.post("/api/admin/ministries", data);

export const deleteMinistry = (id) =>
    api.delete(`/api/admin/ministries/${id}`);

// Gallery
export const getGalleryImages = () =>
    api.get("/api/admin/gallery");

export const uploadGalleryImage = (data) =>
    api.post("/api/admin/gallery", data);

export const deleteGalleryImage = (id) =>
    api.delete(`/api/admin/gallery/${id}`);

// Announcements
export const getAnnouncements = () =>
    api.get("/api/admin/announcements");

export const createAnnouncement = (data) =>
    api.post("/api/admin/announcements", data);

export const deleteAnnouncement = (id) =>
    api.delete(`/api/admin/announcements/${id}`);

// Donations
export const getDonations = () =>
    api.get("/api/admin/donations");

// Users
export const getUsers = () =>
    api.get("/api/admin/users");

// Contacts
export const getContacts = () =>
    api.get("/api/admin/contacts");
