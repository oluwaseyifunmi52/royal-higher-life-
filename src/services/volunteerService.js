import api from "../api/axios";

export const createVolunteer = (data) =>
    api.post("/api/volunteers", data);
