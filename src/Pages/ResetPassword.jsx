import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { resetPassword } from "../services/authApi";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setStatus("Passwords do not match. Please check both fields.");
            return;
        }

        setLoading(true);
        setStatus("");

        try {
            await resetPassword({
                token,
                password: form.password,
                confirmPassword: form.confirmPassword,
            });
            setStatus("Password reset successfully! You can now sign in.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setStatus(
                err.response?.data?.message ||
                "Unable to reset your password. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-hero" aria-labelledby="reset-hero-title">
                <div className="auth-hero-content">
                    <FaLock className="auth-hero-icon" aria-hidden="true" />
                    <p className="auth-eyebrow">Royal Higher Life Ministries</p>
                    <h1 id="reset-hero-title">Set a new password</h1>
                    <p>
                        Choose a strong password you will use to access your account.
                    </p>
                    <div className="auth-verse">
                        <strong>Psalm 62:8</strong>
                        <span>Trust in him at all times, you people.</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel-wrap" aria-labelledby="reset-title">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    className="auth-panel"
                >
                    <div className="auth-heading">
                        <p className="auth-eyebrow">Account Recovery</p>
                        <h2 id="reset-title">Reset password</h2>
                        <p>Enter your new password below.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="reset-password">New password</label>
                            <div className="auth-input-shell">
                                <FaLock aria-hidden="true" />
                                <input
                                    id="reset-password"
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="reset-confirm">Confirm new password</label>
                            <div className="auth-input-shell">
                                <FaEnvelope aria-hidden="true" />
                                <input
                                    id="reset-confirm"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                        </div>

                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    {status && (
                        <p className={`auth-status ${/fail|not match|expired|unable/i.test(status) ? "auth-status-error" : ""}`} role="status" aria-live="polite">
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
