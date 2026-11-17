import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.trim() || "";
const apiConfigurationMissing = !import.meta.env.DEV && !API_URL;
const publicDonationEndpoint = (url = "") =>
    /^\/?api\/donations\/(?:currencies|campaigns)(?:[/?#]|$)/i.test(url);

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        if (apiConfigurationMissing) {
            const error = new Error("The production API URL is not configured.");
            error.code = "API_CONFIGURATION_MISSING";
            return Promise.reject(error);
        }

        const token = localStorage.getItem("token");

        if (token && !publicDonationEndpoint(config.url)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || "";
            if (!publicDonationEndpoint(url)) {
                localStorage.removeItem("token");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
