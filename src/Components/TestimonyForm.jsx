import { useState } from "react";
import { createTestimony } from "../services/testimonyService.js";

export default function TestimonyForm() {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Submitting testimony..." });

        try {
            await createTestimony(Object.fromEntries(new FormData(form)));
            form.reset();
            setStatus({ type: "success", text: "Thank you for sharing your testimony!" });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || error.message || "Failed to submit testimony." });
        }
    }

    return (
        <form className="form-box" id="testimonyForm" onSubmit={handleSubmit}>
            <h3>Share Your Testimony</h3>
            <p className="headline">Let others know what God has done in your life</p>
            <p>Fill out the form below to share your testimony with our community.</p>
            <div className="input-group">
                <label htmlFor="testimonyName">Full Name</label>
                <input id="testimonyName" name="name" placeholder="Your full name" required type="text" />
            </div>
            <div className="input-group">
                <label htmlFor="testimonyEmail">Email Address</label>
                <input id="testimonyEmail" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="testimonyTitle">Title (Optional)</label>
                <input id="testimonyTitle" name="title" placeholder="Give your testimony a title" type="text" />
            </div>
            <div className="input-group prayer-box">
                <label htmlFor="testimony">Your Testimony</label>
                <textarea
                    id="testimony"
                    name="testimony"
                    placeholder="Share your testimony here..."
                    required
                    rows="6"
                />
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Submitting..." : "Submit Testimony"}
            </button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
