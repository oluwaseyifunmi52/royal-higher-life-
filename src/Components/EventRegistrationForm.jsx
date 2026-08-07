import { useState } from "react";
import { registerForEvent } from "../services/eventService.js";

export default function EventRegistrationForm({ eventId, eventName }) {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Registering..." });

        const data = Object.fromEntries(new FormData(form));
        data.eventId = eventId;

        try {
            await registerForEvent(data);
            form.reset();
            setStatus({ type: "success", text: `Successfully registered for ${eventName}!` });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || error.message || "Failed to register for event." });
        }
    }

    return (
        <form className="form-box" id="eventRegistrationForm" onSubmit={handleSubmit}>
            <h3>Register for Event</h3>
            <p className="headline">{eventName}</p>
            <p>Fill out the form below to register for this event.</p>
            <div className="input-group">
                <label htmlFor="regName">Full Name</label>
                <input id="regName" name="name" placeholder="Your full name" required type="text" />
            </div>
            <div className="input-group">
                <label htmlFor="regEmail">Email Address</label>
                <input id="regEmail" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="regPhone">Phone Number</label>
                <input id="regPhone" name="phone" placeholder="+234 Phone Number" required type="tel" />
            </div>
            <div className="input-group">
                <label htmlFor="regGuests">Number of Guests</label>
                <input
                    id="regGuests"
                    name="numberOfGuests"
                    placeholder="Number of guests (including yourself)"
                    required
                    type="number"
                    min="1"
                    defaultValue="1"
                />
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Registering..." : "Register Now"}
            </button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
