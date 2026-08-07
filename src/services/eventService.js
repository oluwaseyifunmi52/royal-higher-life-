import api from "../api/axios";

export const getEvents = () =>
    api.get("/api/events");

export const getEventById = (id) =>
    api.get(`/api/events/${id}`);

export const registerForEvent = (data) =>
    api.post("/api/events/register", data);
