// services/prayerService.js

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_ENDPOINT = `${API_URL}/api/prayers`;

export async function sendPrayerRequest(payload) {

    if (!payload) {
        throw new Error("Prayer request information is required.");
    }

    if (!payload.name?.trim()) {
        throw new Error("Please enter your name.");
    }

    if (!payload.email?.trim()) {
        throw new Error("Please enter your email address.");
    }

    if (!payload.prayer?.trim()) {
        throw new Error("Prayer request cannot be empty.");
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 15000);

    try {

        const response = await fetch(API_ENDPOINT, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },

            body: JSON.stringify(payload),

            signal: controller.signal,

        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to submit prayer request."
            );
        }

        return data;

    } catch (error) {

        clearTimeout(timeout);

        if (error.name === "AbortError") {
            throw new Error("Request timed out. Please try again.");
        }

        throw new Error(
            error.message || "Unable to connect to the server."
        );
    }
}
