import { useState } from "react";
import { createTestimony } from "../services/testimonyService.js";

export default function TestimonyForm() {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Submitting testimony..." });

        try {
            const response = await createTestimony(Object.fromEntries(new FormData(form)));
            const result = response.data?.data;
            form.reset();
            setStatus({
                type: "success",
                text: `Thank you for sharing your testimony. Reference: ${result?.reference || "received"}. It will remain private until review and approval.`,
            });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || "We could not submit your testimony. Check your connection and try again." });
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
                <label htmlFor="testimonyTitle">Title (Optional)</label>
                <input id="testimonyTitle" name="title" placeholder="Give your testimony a title" type="text" />
            </div>
            <div className="input-group">
                <label htmlFor="testimonyEmail">Email Address (Optional)</label>
                <input id="testimonyEmail" name="email" placeholder="For your submission confirmation" type="email" autoComplete="email" />
            </div>
            <div className="input-group">
                <label htmlFor="testimonyRating">Rating</label>
                <select id="testimonyRating" name="rating" required defaultValue="5">
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} out of 5</option>)}
                </select>
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
            <label className="input-group" htmlFor="testimonyConsent">
                <input id="testimonyConsent" name="publicationConsent" type="checkbox" value="true" />
                I consent to my testimony being published if it is approved.
            </label>
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
