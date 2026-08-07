import api from "../api/axios";

export const sendContactMessage = (data) => {
    const name = data.name ||
        [data.firstname, data.lastname].filter(Boolean).join(" ").trim();

    return api.post("/api/contacts", {
        ...data,
        name,
    });
};
