const FALLBACK_MESSAGES = {
    login: "Login could not be completed. Please try again.",
    register: "Your registration could not be completed. Please try again.",
};

export function getAuthErrorMessage(error, action) {
    if (error?.code === "API_CONFIGURATION_MISSING") {
        return "The service is temporarily unavailable. Please try again shortly.";
    }

    if (!error?.response) {
        return "Unable to connect to the server. Please try again.";
    }

    if (error.response.status >= 500) {
        return "The service is temporarily unavailable. Please try again shortly.";
    }

    if (action === "login" && error.response.status === 401) {
        return "Invalid email or password.";
    }

    const serverMessage = error.response.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
        return serverMessage;
    }

    return FALLBACK_MESSAGES[action] || "The request could not be completed. Please try again.";
}
