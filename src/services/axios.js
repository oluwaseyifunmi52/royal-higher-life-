import axios from "axios";

const api = axios.create({
    baseURL: "https://royal-higher-life-backend-2o66.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;