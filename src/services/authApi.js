import api from "../api/axios";

export const registerUser = (userData) =>
    api.post("/auth/register", userData);

export const loginUser = (credentials) =>
    api.post("/auth/login", credentials);

export const verifyEmail = (data) =>
    api.post("/auth/verify-email", data);

export const resendOTP = (email) =>
    api.post("/auth/resend-otp", { email });

export const forgotPassword = (email) =>
    api.post("/auth/forgot-password", { email });

export const resetPassword = (data) =>
    api.post("/auth/reset-password", data);

export const getProfile = () =>
    api.get("/auth/profile");

export const logoutUser = () => {
    localStorage.removeItem("token");
};