import api from "../api/axios";

export const createPartnership = (data) =>
    api.post("/api/partnerships", data);
