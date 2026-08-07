import api from "../api/axios";

export const processDonation = (data) =>
    api.post("/api/donations", data);
