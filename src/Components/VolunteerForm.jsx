import { useState } from "react";
import { createVolunteer } from "../services/volunteerService.js";

export default function VolunteerForm() {
    const [status, setStatus] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Submitting application..." });

        try {
            await createVolunteer(Object.fromEntries(new FormData(form)));
            form.reset();
            setStatus({ type: "success", text: "Thank you for volunteering! We will get back to you soon." });
        } catch (error) {
            setStatus({ type: "error", text: error.response?.data?.message || error.message || "Failed to submit application." });
        }
    }

    return (
        <form className="form-box" id="volunteerForm" onSubmit={handleSubmit}>
            <h3>Volunteer With Us</h3>
            <p className="headline">Join our team and make a difference</p>
            <p>Fill out the form below to apply as a volunteer.</p>
            <div className="row">
                <div className="input-group">
                    <label htmlFor="volFirstName">First Name</label>
                    <input id="volFirstName" name="firstName" placeholder="First Name" required type="text" />
                </div>
                <div className="input-group">
                    <label htmlFor="volLastName">Last Name</label>
                    <input id="volLastName" name="lastName" placeholder="Last Name" required type="text" />
                </div>
            </div>
            <div className="input-group">
                <label htmlFor="volEmail">Email Address</label>
                <input id="volEmail" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="volPhone">Phone Number</label>
                <input id="volPhone" name="phone" placeholder="+234 Phone Number" required type="tel" />
            </div>
            <div className="input-group prayer-box">
                <label htmlFor="volSkills">Skills</label>
                <textarea
                    id="volSkills"
                    name="skills"
                    placeholder="List any relevant skills you have..."
                    rows="3"
                />
            </div>
            <div className="input-group">
                <label htmlFor="volAvailability">Availability</label>
                <select id="volAvailability" name="availability" required defaultValue="">
                    <option value="" disabled>
                        -- Select Availability --
                    </option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Weekends</option>
                    <option>Flexible</option>
                </select>
            </div>
            <div className="input-group prayer-box">
                <label htmlFor="volMotivation">Why do you want to volunteer?</label>
                <textarea
                    id="volMotivation"
                    name="motivation"
                    placeholder="Tell us why you want to volunteer..."
                    required
                    rows="4"
                />
            </div>
            <button type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Submitting..." : "Submit Application"}
            </button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
