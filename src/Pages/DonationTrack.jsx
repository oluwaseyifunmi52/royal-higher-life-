import { useState } from "react";
import { Link } from "react-router-dom";
import {
    confirmDonationTracking,
    requestDonationTracking,
} from "../services/donationService";
import {
    donationStatusLabel,
    formatCurrency,
    PROVIDER_LABELS,
} from "../utils/currency";

export default function DonationTrack() {
    const [reference, setReference] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [requested, setRequested] = useState(false);
    const [message, setMessage] = useState("");
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(false);

    async function requestCode(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        setDonation(null);
        try {
            const response = await requestDonationTracking({ reference, email });
            setRequested(true);
            setMessage(
                response.data?.message ||
                    "If the details match a donation, a one-time code has been sent."
            );
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Unable to process the lookup right now. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function confirmCode(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await confirmDonationTracking({ reference, email, code });
            setDonation(response.data?.data || null);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "The code could not be verified."
            );
        } finally {
            setLoading(false);
        }
    }

    function startOver() {
        setRequested(false);
        setCode("");
        setDonation(null);
        setMessage("");
    }

    return (
        <main className="donation-result page-container">
            <h1>Track a donation</h1>
            <p>
                Enter the reference from your payment or receipt email and the email address
                used at checkout. We will email a one-time code before showing the receipt
                details.
            </p>

            <form
                className="donation-form donation-track-form"
                onSubmit={requested ? confirmCode : requestCode}
            >
                <div className="field-group">
                    <label className="field-label" htmlFor="donation-reference">
                        Donation reference
                    </label>
                    <input
                        id="donation-reference"
                        value={reference}
                        onChange={(event) => setReference(event.target.value.trim())}
                        required
                        maxLength={100}
                        autoComplete="off"
                    />
                </div>
                <div className="field-group">
                    <label className="field-label" htmlFor="donation-track-email">
                        Email address
                    </label>
                    <input
                        id="donation-track-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        maxLength={254}
                        autoComplete="email"
                    />
                </div>
                {requested && (
                    <div className="field-group">
                        <label className="field-label" htmlFor="donation-code">
                            Email verification code
                        </label>
                        <input
                            id="donation-code"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="[0-9]{6}"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            required
                        />
                    </div>
                )}
                <button className="donate-btn" type="submit" disabled={loading}>
                    {loading
                        ? "Please wait…"
                        : requested
                          ? "View donation receipt"
                          : "Email me a verification code"}
                </button>
                {message && <p role="status">{message}</p>}
                {requested && (
                    <button type="button" className="donation-link-btn" onClick={startOver}>
                        Use a different reference
                    </button>
                )}
            </form>

            {donation && (
                <section aria-live="polite">
                    <h2>Verified donation</h2>
                    <dl>
                        <dt>Reference</dt>
                        <dd>{donation.paymentReference}</dd>
                        <dt>Donor</dt>
                        <dd>
                            {donation.isAnonymous
                                ? "Anonymous"
                                : donation.donorName || donation.email}
                        </dd>
                        <dt>Amount</dt>
                        <dd>
                            {formatCurrency(donation.amount, donation.currency)}{" "}
                            {donation.currency}
                        </dd>
                        <dt>Purpose</dt>
                        <dd>{donation.donationType}</dd>
                        {donation.campaign?.title && (
                            <>
                                <dt>Campaign</dt>
                                <dd>{donation.campaign.title}</dd>
                            </>
                        )}
                        <dt>Status</dt>
                        <dd>
                            {donationStatusLabel(donation.status, donation.verifiedAt)}
                        </dd>
                        {donation.provider && (
                            <>
                                <dt>Payment provider</dt>
                                <dd>
                                    {PROVIDER_LABELS[donation.provider] || donation.provider}
                                </dd>
                            </>
                        )}
                        {donation.receiptNumber && (
                            <>
                                <dt>Receipt number</dt>
                                <dd>{donation.receiptNumber}</dd>
                            </>
                        )}
                        <dt>Date</dt>
                        <dd>
                            {new Date(
                                donation.verifiedAt || donation.createdAt
                            ).toLocaleString()}
                        </dd>
                    </dl>
                    <button type="button" onClick={() => window.print()}>
                        Print receipt
                    </button>
                </section>
            )}

            <p>
                <Link to="/donate">Return to giving</Link>
            </p>
        </main>
    );
}
