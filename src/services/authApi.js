import api from "../api/axios";

export const registerUser = (userData) =>
    api.post("/api/auth/register", userData);

export const loginUser = (credentials) =>
    api.post("/api/auth/login", credentials);

export const verifyEmail = (data) =>
    api.post("/api/auth/verify-email", data);

export const resendOTP = (email) =>
    api.post("/api/auth/resend-otp", { email });

export const forgotPassword = (email) =>
    api.post("/api/auth/forgot-password", { email });

export const resetPassword = (data) =>
    api.post("/api/auth/reset-password", data);

export const getProfile = () =>
    api.get("/api/auth/profile");

export const logoutUser = () => {
    localStorage.removeItem("token");
};
