import { useState } from "react";
import { sendPrayerRequest } from "../services/prayerService.js";

export default function PrayerForm() {
    const [sent, setSent] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        sendPrayerRequest(Object.fromEntries(new FormData(event.currentTarget)));
        setSent(true);
        event.currentTarget.reset();
    }

    return (
        <form className="form-box" id="prayerForm" onSubmit={handleSubmit}>
            <h3>Prayer Request Form</h3>
            <p className="headline">Share Your Prayer - We Are Here to Pray With You</p>
            <p>Fill out the form below to submit your prayer request.</p>
            <p>
                All submissions are reviewed by our ministry team before being shared with our prayer partners. Your request
                will be kept confidential and handled with care.
            </p>
            <div className="input-group">
                <label>Name</label>
                <div className="row">
                    <input name="firstname" placeholder="First Name" required type="text" />
                    <input name="lastname" placeholder="Last Name" required type="text" />
                </div>
            </div>
            <div className="input-group">
                <label htmlFor="prayerEmail">Email Address</label>
                <input id="prayerEmail" name="email" placeholder="Email Address" required type="email" />
            </div>
            <div className="input-group">
                <label htmlFor="prayerPhone">Phone Number</label>
                <input id="prayerPhone" name="phone" placeholder="+234 Phone Number" required type="tel" />
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
                <small className="hint">Your request will be kept confidential and handled with care by our ministry team.</small>
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
            <button type="submit">Submit Prayer</button>
            {sent && <p className="success-inline">Prayer request submitted successfully.</p>}
        </form>
    );
}