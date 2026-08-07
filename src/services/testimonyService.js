import api from "../api/axios";

export const createTestimony = (data) =>
    api.post("/api/testimonies", data);
