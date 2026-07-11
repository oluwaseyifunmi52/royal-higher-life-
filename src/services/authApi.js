// src/api/authApi.js
import api from "./axios";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const verifyEmail = (data) => api.post("/auth/verify-email", data);
export const resendOTP = (email) => api.post("/auth/resend-otp", { email });
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const getProfile = () => api.get("/auth/profile");