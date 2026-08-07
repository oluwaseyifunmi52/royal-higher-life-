import api from "../api/axios";

export const updateProfile = (data) =>
    api.put("/api/auth/profile", data);

export const changePassword = (data) =>
    api.put("/api/auth/change-password", data);
