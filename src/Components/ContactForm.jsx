import { useState } from "react";
import { sendContactMessage } from "../services/contactService.js";

export default function ContactForm() {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Sending message..." });

        try {
            await sendContactMessage(Object.fromEntries(new FormData(form)));
            form.reset();
            setStatus({ type: "success", text: "Thank you! We will get back to you soon." });
        } catch (error) {
            setStatus({ type: "error", text: error.message });
        }
    }

    return (
        <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
            <h1>Contact Us</h1>
            <p className="subtitle">We would love to hear from you! Send us a message and we will respond quickly.</p>
            <div className="row">
                <div className="input-group">
                    <label htmlFor="firstname">First Name</label>
                    <input id="firstname" name="firstname" placeholder="First Name" required type="text" />
                </div>
                <div className="input-group">
                    <label htmlFor="lastname">Last Name</label>
                    <input id="lastname" name="lastname" placeholder="Last Name" required type="text" />
                </div>
            </div>
            <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" placeholder="+234 Phone Number" required type="tel" />
            </div>
            <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" required defaultValue="">
                    <option value="" disabled>
                        -- Select Subject --
                    </option>
                    <option>Prayer Request</option>
                    <option>Volunteer Inquiry</option>
                    <option>Donation Inquiry</option>
                    <option>General Question</option>
                </select>
            </div>
            <div className="input-group message-box">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Write your message..." required rows="6" />
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Sending..." : "Send Message"}
            </button>
            {status && (
                <div
                    className={`form-status ${status.type}`}
                    role="status"
                    aria-live="polite"
                >
                    {status.text}
                </div>
            )}
        </form>
    );
}
