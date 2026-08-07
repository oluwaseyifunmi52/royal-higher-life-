import api from "../api/axios";

export const saveReview = (data) =>
    api.post("/api/reviews", data);
