import api from "../api/axios";

export const createVolunteer = (data) => {
    const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
    return api.post("/api/volunteers", {
        ...data,
        name,
    });
};
