
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_ENDPOINT = `${API_URL}/api/contacts`;

export async function sendContactMessage(payload) {

    if (!payload) {
        throw new Error("Contact information is required.");
    }

    if (!payload.name?.trim()) {
        throw new Error("Name is required.");
    }

    if (!payload.email?.trim()) {
        throw new Error("Email is required.");
    }

    if (!payload.message?.trim()) {
        throw new Error("Message is required.");
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
                Accept: "application/json"
            },

            body: JSON.stringify(payload),

            signal: controller.signal

        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to send message."
            );
        }

        return data;

    } catch (error) {

        clearTimeout(timeout);

        if (error.name === "AbortError") {
            throw new Error("Request timed out.");
        }

        throw new Error(
            error.message || "Unable to connect to the server."
        );
    }
}