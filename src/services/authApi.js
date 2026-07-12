import api from "../api/axios";

// Register
export const registerUser = (userData) =>
    api.post("/auth/register", userData);

// Login
export const loginUser = (credentials) =>
    api.post("/auth/login", credentials);

// Verify Email OTP
export const verifyEmail = (data) =>
    api.post("/auth/verify-email", data);

// Resend OTP
export const resendOTP = (email) =>
    api.post("/auth/resend-otp", { email });

// Forgot Password
export const forgotPassword = (email) =>
    api.post("/auth/forgot-password", { email });

// Reset Password
export const resetPassword = (data) =>
    api.post("/auth/reset-password", data);

// Get Logged-in User
export const getProfile = () =>
    api.get("/auth/profile");

// Logout (Frontend)
export const logoutUser = () => {
    localStorage.removeItem("token");
};