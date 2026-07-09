
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_ENDPOINT = `${API_URL}/api/donations`;

export async function processDonation(payload) {

    if (!payload)
        throw new Error("Donation information is required.");

    const amount = Number(payload.amount);

    if (Number.isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid donation amount.");
    }

    if (!payload.currency) {
        throw new Error("Please select a currency.");
    }

    if (!payload.payment) {
        throw new Error("Please select a payment method.");
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

            body: JSON.stringify({
                ...payload,
                amount
            }),

            signal: controller.signal

        });

        clearTimeout(timeout);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Donation request failed."
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
