import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { forgotPassword } from "../services/authApi";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setStatus("");

        try {
            await forgotPassword(email);
            setStatus("Password reset instructions sent to your email.");
        } catch (err) {
            setStatus(
                err.response?.data?.message ||
                "Unable to send reset instructions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-hero" aria-labelledby="forgot-hero-title">
                <div className="auth-hero-content">
                    <FaLock className="auth-hero-icon" aria-hidden="true" />
                    <p className="auth-eyebrow">Royal Higher Life Ministries</p>
                    <h1 id="forgot-hero-title">Reset your password</h1>
                    <p>
                        Enter the email address you registered with and we will send you
                        instructions to reset your password.
                    </p>
                    <div className="auth-verse">
                        <strong>Philippians 4:6</strong>
                        <span>Present your requests to God.</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel-wrap" aria-labelledby="forgot-title">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    className="auth-panel"
                >
                    <div className="auth-heading">
                        <p className="auth-eyebrow">Account Recovery</p>
                        <h2 id="forgot-title">Forgot password</h2>
                        <p>We will email you a link to reset your password.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="forgot-email">Email address</label>
                            <div className="auth-input-shell">
                                <FaEnvelope aria-hidden="true" />
                                <input
                                    id="forgot-email"
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Instructions"}
                        </button>
                    </form>

                    {status && (
                        <p className={`auth-status ${/unable|fail|not found/i.test(status) ? "auth-status-error" : ""}`} role="status" aria-live="polite">
                            {status}
                        </p>
                    )}

                    <p className="auth-switch">
                        Remembered your password? <Link to="/login">Sign in</Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
