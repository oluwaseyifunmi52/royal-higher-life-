import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyDonation } from "../services/donationService";
import {
    donationStatusLabel,
    formatCurrency,
    PROVIDER_LABELS,
} from "../utils/currency";

const PENDING_KEY = "rhlm_pending_donation_reference";

export default function DonationComplete() {
    const [search] = useSearchParams();
    const referenceParam = search.get("reference") || search.get("trxref") || "";
    const cancelled = search.get("cancelled") === "1" || search.get("status") === "cancelled";
    const [state, setState] = useState({
        loading: true,
        donation: null,
        error: "",
    });

    const checkStatus = useCallback(async () => {
        const reference =
            referenceParam || sessionStorage.getItem(PENDING_KEY) || "";
        if (!reference) {
            setState({
                loading: false,
                donation: null,
                error: "No payment reference was provided. You can look up your donation using its email and reference.",
            });
            return;
        }

        setState((current) => ({ ...current, loading: true, error: "" }));
        try {
            const response = await verifyDonation(reference);
            const donation = response.data?.data || null;
            if (donation?.status === "successful" && donation.verifiedAt) {
                sessionStorage.removeItem(PENDING_KEY);
            }
            setState({ loading: false, donation, error: "" });
        } catch (error) {
            setState({
                loading: false,
                donation: null,
                error:
                    error.response?.data?.message ||
                    "We could not confirm your payment yet. Please check again shortly.",
            });
        }
    }, [referenceParam]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const donation = state.donation;
    const verified = donation?.status === "successful" && Boolean(donation.verifiedAt);

    return (
        <main className="donation-result page-container" aria-live="polite">
            <h1>Donation payment</h1>

            {state.loading ? (
                <p>Checking payment status with the payment provider…</p>
            ) : donation ? (
                <>
                    <h2>
                        {verified
                            ? "Thank you — your donation is confirmed"
                            : donation.status === "failed"
                              ? "Payment was not completed"
                              : "Payment is still processing"}
                    </h2>
                    <p>
                        {verified
                            ? donation.receiptSentAt
                                ? "A receipt has been sent to the email address used at checkout."
                                : "Your payment is verified. A receipt will be sent when the receipt email service is available."
                            : "This page only reports the status confirmed by our server. You can check again shortly."}
                    </p>
                    {cancelled && !verified && (
                        <p className="donation-status error" role="status">
                            Checkout was cancelled before a payment was completed.
                        </p>
                    )}
                    <dl>
                        <dt>Reference</dt>
                        <dd>{donation.paymentReference || "—"}</dd>
                        <dt>Amount</dt>
                        <dd>
                            {formatCurrency(donation.amount, donation.currency)}{" "}
                            {donation.currency}
                        </dd>
                        <dt>Currency</dt>
                        <dd>{donation.currency}</dd>
                        <dt>Status</dt>
                        <dd>{donationStatusLabel(donation.status, donation.verifiedAt)}</dd>
                        {donation.provider && (
                            <>
                                <dt>Payment provider</dt>
                                <dd>{PROVIDER_LABELS[donation.provider] || donation.provider}</dd>
                            </>
                        )}
                        {donation.campaign?.title && (
                            <>
                                <dt>Campaign</dt>
                                <dd>{donation.campaign.title}</dd>
                            </>
                        )}
                        {donation.receiptNumber && (
                            <>
                                <dt>Receipt number</dt>
                                <dd>{donation.receiptNumber}</dd>
                            </>
                        )}
                        {donation.verifiedAt && (
                            <>
                                <dt>Verified on</dt>
                                <dd>{new Date(donation.verifiedAt).toLocaleString()}</dd>
                            </>
                        )}
                    </dl>
                    {!verified && (
                        <button
                            type="button"
                            className="donate-btn donation-retry-btn"
                            onClick={checkStatus}
                        >
                            Check payment status again
                        </button>
                    )}
                </>
            ) : (
                <p role="alert">{state.error}</p>
            )}

            <p>
                <Link to="/donations/track">Track or retrieve a donation receipt</Link>
            </p>
            <p>
                <Link to="/donate">Return to giving</Link>
            </p>
        </main>
    );
}
