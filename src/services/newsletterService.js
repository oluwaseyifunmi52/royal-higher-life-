import api from "../api/axios";

export const subscribeNewsletter = (data) =>
    api.post("/api/newsletter", data);
