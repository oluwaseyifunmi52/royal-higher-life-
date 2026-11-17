import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { resendOTP, verifyEmail } from "../services/authApi";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const token = searchParams.get("token");
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const emailWasSent = location.state?.verificationEmailSent;

    async function handleVerify(event) {
        event.preventDefault();
        if (!token) return;
        setLoading(true);
        setStatus("");
        try {
            await verifyEmail({ token });
            setVerified(true);
            setStatus("Your email is verified. You can now sign in.");
        } catch {
            setStatus("This verification link is invalid or expired. Request a new link below.");
        } finally {
            setLoading(false);
        }
    }

    async function handleResend(event) {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        try {
            const response = await resendOTP(email);
            setStatus(response.data?.message || "If an unverified account matches that email, a verification link can be sent.");
        } catch {
            setStatus("We could not process that request. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-hero" aria-labelledby="verify-hero-title">
                <div className="auth-hero-content">
                    <FaEnvelope className="auth-hero-icon" aria-hidden="true" />
                    <p className="auth-eyebrow">Royal Higher Life Ministries</p>
                    <h1 id="verify-hero-title">Verify your email</h1>
                    <p>Confirm your email address to complete your ministry account setup.</p>
                </div>
            </section>
            <section className="auth-panel-wrap" aria-labelledby="verify-title">
                <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="auth-panel">
                    <div className="auth-heading">
                        <p className="auth-eyebrow">Account Verification</p>
                        <h2 id="verify-title">{verified ? "Email verified" : "Check your inbox"}</h2>
                        {emailWasSent === false
                            ? <p>Your account was created, but we could not confirm email delivery. You can request another link below.</p>
                            : <p>Use the secure verification link in your email. Links expire after 10 minutes.</p>}
                    </div>

                    {token && !verified && (
                        <form className="auth-form" onSubmit={handleVerify}>
                            <button className="auth-submit" type="submit" disabled={loading}>
                                {loading ? "Verifying..." : "Verify Email Address"}
                            </button>
                        </form>
                    )}

                    {!verified && (
                        <form className="auth-form" onSubmit={handleResend}>
                            <div className="auth-field">
                                <label htmlFor="verify-email-address">Email Address</label>
                                <div className="auth-input-shell">
                                    <FaEnvelope aria-hidden="true" />
                                    <input id="verify-email-address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
                                </div>
                            </div>
                            <button className="auth-submit" type="submit" disabled={loading}>
                                {loading ? "Requesting..." : "Resend Verification Link"}
                            </button>
                        </form>
                    )}

                    {status && <p className="auth-status" role="status" aria-live="polite">{status}</p>}
                    <p className="auth-switch"><Link to="/login">Go to sign in</Link></p>
                </motion.div>
            </section>
        </main>
    );
}
