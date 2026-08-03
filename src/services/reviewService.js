// services/reviewService.js

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

const API_ENDPOINT = `${API_URL}/api/reviews`;

export async function saveReview(payload) {

    if (!payload) {
        throw new Error("Review information is required.");
    }

    if (!payload.name?.trim()) {
        throw new Error("Please enter your name.");
    }

    const message = payload.message?.trim() || payload.comment?.trim();

    if (!message) {
        throw new Error("Please enter your review.");
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

            body: JSON.stringify({
                ...payload,
                message,
            }),

            signal: controller.signal,

        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to submit your review."
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
