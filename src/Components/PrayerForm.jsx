import { useRef, useState } from "react";
import { sendPrayerRequest } from "../services/prayerService.js";

export default function PrayerForm() {
    const [status, setStatus] = useState(null);
    const submissionKey = useRef("");

    function getSubmissionKey() {
        if (submissionKey.current) return submissionKey.current;
        try { submissionKey.current = sessionStorage.getItem("rhl-prayer-submission-key") || ""; } catch { /* storage may be unavailable */ }
        if (!submissionKey.current) {
            submissionKey.current = globalThis.crypto?.randomUUID?.() ||
                `prayer_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            try { sessionStorage.setItem("rhl-prayer-submission-key", submissionKey.current); } catch { /* in-memory retry remains available */ }
        }
        return submissionKey.current;
    }

    function clearSubmissionKey() {
        submissionKey.current = "";
        try { sessionStorage.removeItem("rhl-prayer-submission-key"); } catch { /* ignore storage errors */ }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Submitting prayer request..." });

        try {
            const response = await sendPrayerRequest({
                ...Object.fromEntries(new FormData(form)),
                submissionKey: getSubmissionKey(),
            });
            const result = response.data?.data;
            form.reset();
            clearSubmissionKey();
            setStatus({
                type: "success",
                text: `Your confidential prayer request was received. Reference: ${result?.reference || "received"}.${response.data?.emailNotificationQueued ? " Email notifications are queued for processing." : response.data?.emailNotificationsSent === false ? " Email delivery could not be confirmed, but the request was saved." : ""}`,
            });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || "We could not submit your prayer request. Check your connection and try again." });
        }
    }

    return (
        <form className="form-box" id="prayerForm" onSubmit={handleSubmit} onInput={() => {
            if (status?.type === "loading") return;
            let storedKey = false;
            try { storedKey = Boolean(sessionStorage.getItem("rhl-prayer-submission-key")); } catch { /* storage may be unavailable */ }
            if (submissionKey.current || storedKey) clearSubmissionKey();
        }}>
            <h3>Prayer Request Form</h3>
            <p className="headline">Share Your Prayer - We Are Here to Pray With You</p>
            <p className="prayer-intro-line">Fill out the form below to submit your prayer request.</p>
            <p className="prayer-privacy-notice">
                All submissions are reviewed by our ministry team before being shared with our prayer partners. Your request
                will be kept confidential and handled with care.
            </p>
            <div className="input-group">
                <label htmlFor="prayerFirstName">First Name</label>
                <div className="row">
                    <input id="prayerFirstName" name="firstname" placeholder="First Name" required type="text" autoComplete="given-name" />
                    <label className="sr-only" htmlFor="prayerLastName">Last Name</label>
                    <input id="prayerLastName" name="lastname" placeholder="Last Name" required type="text" autoComplete="family-name" />
                </div>
            </div>
            <div className="input-group">
                <label htmlFor="prayerEmail">Email Address</label>
                <input id="prayerEmail" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="prayerPhone">Phone Number</label>
                <input id="prayerPhone" name="phone" placeholder="+234 Phone Number (optional)" type="tel" />
            </div>
            <div className="input-group prayer-box">
                <label htmlFor="prayer">Prayer Request</label>
                <textarea
                    id="prayer"
                    name="prayer"
                    placeholder="Write your prayer request here..."
                    required
                    rows="6"
                />
                <small className="hint prayer-privacy-hint">Your request will be kept confidential and handled with care by our ministry team.</small>
            </div>
            <div className="input-group">
                <label htmlFor="category">Category of Prayer</label>
                <select id="category" name="category" required defaultValue="">
                    <option value="" disabled>
                        -- Select Category --
                    </option>
                    <option>Healing</option>
                    <option>Financial Breakthrough</option>
                    <option>Family</option>
                    <option>Spiritual Growth</option>
                    <option>General Prayer</option>
                </select>
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Submitting..." : "Submit Prayer"}
            </button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
