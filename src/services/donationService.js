import api from "../api/axios";

export const processDonation = (data) =>
    api.post("/api/donations", data);

export const getDonationCurrencies = () => api.get("/api/donations/currencies");
export const getDonationCampaigns = () => api.get("/api/donations/campaigns");
export const verifyDonation = (reference) => api.post("/api/donations/verify", { reference });
export const requestDonationTracking = (data) => api.post("/api/donations/track/request", data);
export const confirmDonationTracking = (data) => api.post("/api/donations/track/confirm", data);
