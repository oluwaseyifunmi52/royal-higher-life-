import { useState } from "react";
import { createPartnership } from "../services/partnershipService.js";

export default function PartnershipForm() {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Submitting partnership request..." });

        try {
            await createPartnership(Object.fromEntries(new FormData(form)));
            form.reset();
            setStatus({ type: "success", text: "Thank you for your partnership interest! We will contact you soon." });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || error.message || "Failed to submit partnership request." });
        }
    }

    return (
        <form className="form-box" id="partnershipForm" onSubmit={handleSubmit}>
            <h3>Partner With Us</h3>
            <p className="headline">Let's work together to make a lasting impact</p>
            <p>Fill out the form below to express your partnership interest.</p>
            <div className="input-group">
                <label htmlFor="partnerOrg">Organization Name</label>
                <input id="partnerOrg" name="organization" placeholder="Your organization name" required type="text" />
            </div>
            <div className="input-group">
                <label htmlFor="partnerContact">Contact Person</label>
                <input id="partnerContact" name="contactName" placeholder="Contact person's name" required type="text" />
            </div>
            <div className="input-group">
                <label htmlFor="partnerEmail">Email Address</label>
                <input id="partnerEmail" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="partnerPhone">Phone Number</label>
                <input id="partnerPhone" name="phone" placeholder="+234 Phone Number" required type="tel" />
            </div>
            <div className="input-group">
                <label htmlFor="partnerType">Partnership Type</label>
                <select id="partnerType" name="partnershipType" required defaultValue="">
                            <option value="" disabled>
                                -- Select Partnership Type --
                            </option>
                            <option value="financial">Financial</option>
                            <option value="outreach">Strategic</option>
                            <option value="outreach">Community</option>
                            <option value="media">Media</option>
                            <option value="other">Other</option>
                </select>
            </div>
            <div className="input-group prayer-box">
                <label htmlFor="partnerMessage">Message</label>
                <textarea
                    id="partnerMessage"
                    name="message"
                    placeholder="Tell us about your partnership proposal..."
                    required
                    rows="6"
                />
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Submitting..." : "Submit Partnership Request"}
            </button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
