import api from "../api/axios";

export const sendPrayerRequest = (data) => {
    const name = data.name ||
        [data.firstname, data.lastname].filter(Boolean).join(" ").trim();

    return api.post("/api/prayers", {
        ...data,
        name,
    });
};
