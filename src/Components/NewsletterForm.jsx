import { useState } from "react";
import { subscribeNewsletter } from "../services/newsletterService.js";

export default function NewsletterForm() {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Subscribing..." });

        try {
            await subscribeNewsletter(Object.fromEntries(new FormData(form)));
            form.reset();
            setStatus({ type: "success", text: "Successfully subscribed to our newsletter!" });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || error.message || "Failed to subscribe." });
        }
    }

    return (
        <form className="form-box" id="newsletterForm" onSubmit={handleSubmit}>
            <h3>Subscribe to Our Newsletter</h3>
            <p className="headline">Stay updated with our latest news and events</p>
            <div className="input-group">
                <label htmlFor="newsletterEmail">Email Address</label>
                <input id="newsletterEmail" name="email" placeholder="Enter your email address" required type="email" />
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
