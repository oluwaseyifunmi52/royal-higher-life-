import { useRef, useState } from "react";
import { saveReview } from "../services/reviewService.js";

export default function TestimonyForm() {
    const [status, setStatus] = useState(null);
    const [step, setStep] = useState(1);
    const formRef = useRef(null);

    function isMobileLayout() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function goToStepTwo() {
        const firstInvalid = formRef.current?.querySelector('[data-testimony-step="1"] :invalid');
        if (firstInvalid) {
            firstInvalid.reportValidity();
            return;
        }
        setStep(2);
    }

    function preventStepOneEnter(event) {
        if (event.key === "Enter" && isMobileLayout() && step === 1 && event.target.tagName !== "TEXTAREA") {
            event.preventDefault();
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const mobileLayout = isMobileLayout();
        if (mobileLayout && step === 1) return;
        if (status?.type === "loading") return;

        const form = event.currentTarget;
        setStatus({ type: "loading", text: "Submitting testimony..." });

        try {
            const response = await saveReview(Object.fromEntries(new FormData(form)));
            const result = response.data?.data;
            form.reset();
            setStep(1);
            setStatus({
                type: "success",
                text: `Thank you for sharing your testimony. Reference: ${result?.reference || "received"}. It will remain private until review and approval.`,
            });
        } catch (error) {
            const responseData = error.response?.data || {};
            const fieldErrors = responseData.errors || responseData.fieldErrors || responseData.details;
            const stepOneError = Array.isArray(fieldErrors)
                ? fieldErrors.some((item) => /^(name|title|rating)$/i.test(item?.field || item?.path || ""))
                : fieldErrors && typeof fieldErrors === "object"
                    ? Object.keys(fieldErrors).some((field) => /^(name|title|rating)$/i.test(field))
                    : /\b(name|title|rating)\b/i.test(responseData.message || "");
            if (mobileLayout && stepOneError) setStep(1);
            setStatus({ type: "error", text: error.response?.data?.message || "We could not submit your testimony. Check your connection and try again." });
        }
    }

    return (
        <form ref={formRef} className="form-box testimony-form" id="testimonyForm" data-mobile-step={step} onSubmit={handleSubmit} onKeyDown={preventStepOneEnter}>
            <h3><span className="testimony-desktop-heading">Share Your Testimony</span><span className="testimony-mobile-heading">Share your testimony</span></h3>
            <p className="headline">Let others know what God has done in your life</p>
            <p className="testimony-intro">Fill out the form below to share your testimony with our community.</p>
            <div className="input-group testimony-name-field" data-testimony-step="1">
                <label htmlFor="testimonyName">Full Name</label>
                <input id="testimonyName" name="name" placeholder="Your full name" required type="text" />
            </div>
            <div className="input-group testimony-title-field" data-testimony-step="1">
                <label htmlFor="testimonyTitle">Title (Optional)</label>
                <input id="testimonyTitle" name="title" placeholder="Give your testimony a title" type="text" />
            </div>
            <div className="input-group testimony-email-field" data-testimony-step="2">
                <label htmlFor="testimonyEmail">Email (Optional)</label>
                <input id="testimonyEmail" name="email" placeholder="For your confirmation" type="email" autoComplete="email" />
            </div>
            <div className="input-group testimony-rating-field" data-testimony-step="1">
                <label htmlFor="testimonyRating">Rating</label>
                <select id="testimonyRating" name="rating" required defaultValue="5">
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} out of 5</option>)}
                </select>
            </div>
            <div className="input-group prayer-box testimony-message-field" data-testimony-step="2">
                <label htmlFor="testimony">Your Testimony</label>
                <textarea
                    id="testimony"
                    name="message"
                    placeholder="Share your testimony here..."
                    required
                    rows="6"
                />
            </div>
            <label className="input-group testimony-consent-field" htmlFor="testimonyConsent" data-testimony-step="2">
                <input id="testimonyConsent" name="publicationConsent" type="checkbox" value="true" />
                I consent to my testimony being published if it is approved.
            </label>
            <button className="testimony-next" type="button" onClick={goToStepTwo}>
                Next
            </button>
            <button className="testimony-submit" type="submit" disabled={status?.type === "loading"}>
                {status?.type === "loading" ? "Submitting..." : <><span className="testimony-desktop-heading">Submit Testimony</span><span className="testimony-mobile-heading">Submit testimony</span></>}
            </button>
            <button className="testimony-back" type="button" onClick={() => setStep(1)}>Back</button>
            {status && (
                <p className={`form-status ${status.type}`} role="status" aria-live="polite">
                    {status.text}
                </p>
            )}
        </form>
    );
}
