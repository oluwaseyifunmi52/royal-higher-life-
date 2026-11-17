import api from "../api/axios";

export const createTestimony = (data) =>
    api.post("/api/reviews", {
        name: data.name,
        email: data.email?.trim() || "",
        title: data.title?.trim() || "",
        message: data.testimony?.trim() || data.message?.trim() || "",
        rating: Number(data.rating),
        publicationConsent: data.publicationConsent === true || data.publicationConsent === "true",
    });
