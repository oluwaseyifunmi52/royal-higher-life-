import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { forgotPassword, resetPassword } from "../services/authApi";

const VAGUE_MESSAGE =
    "If an account matches that email, password reset instructions can be sent when email delivery is available.";

export default function ForgotPassword({ adminMode = false }) {
    const [step, setStep] = useState("email"); // "email" | "code"
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendSeconds, setResendSeconds] = useState(0);

    const canResend = resendSeconds <= 0;

    // Countdown timer for resend button
    useEffect(() => {
        if (resendSeconds > 0) {
            const timer = setInterval(() => {
                setResendSeconds((prev) => (prev <= 0 ? 0 : prev - 1));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendSeconds]);

    async function handleSendCode(e) {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            await forgotPassword(email);
            setStep("code");
            setResendSeconds(60);
        } catch (err) {
            setStatus(
                err.response?.data?.message ||
                "Unable to send reset instructions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResendCode(e) {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            await forgotPassword(email);
            setResendSeconds(60);
        } catch (err) {
            setStatus(
                err.response?.data?.message ||
                "Unable to resend code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        try {
            await resetPassword({
                code,
                password,
                confirmPassword,
            });
            setStatus("Password reset successfully! You can now sign in.");
            setTimeout(() => {
                window.location.href = adminMode ? "/admin/login" : "/login";
            }, 1500);
        } catch (err) {
            setStatus(
                err.response?.data?.message ||
                "Unable to reset your password. The code may have expired."
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
                    <h1 id="forgot-hero-title">{step === "email" ? "Reset your password" : "Enter your reset code"}</h1>
                    <p>
                        {step === "email"
                            ? "Enter the email address you registered with and we will send you a code to reset your password."
                            : "Enter the 6-digit code sent to your email and choose a new password."}
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
                        <h2 id="forgot-title">{step === "email" ? "Forgot password" : "Reset password"}</h2>
                        <p>
                            {step === "email"
                                ? "We will email you a 6-digit code to reset your password."
                                : "Enter the code and your new password below."}
                        </p>
                    </div>

                    {step === "email" ? (
                        <form className="auth-form" onSubmit={handleSendCode}>
                            <div className="auth-field">
                                <label htmlFor="forgot-email">Email Address</label>
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
                                {loading ? "Sending..." : "Send Code"}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleResetPassword}>
                            <div className="auth-field">
                                <label htmlFor="reset-code">Reset Code</label>
                                <div className="auth-input-shell">
                                    <FaEnvelope aria-hidden="true" />
                                    <input
                                        id="reset-code"
                                        type="text"
                                        name="code"
                                        maxlength="6"
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        autoComplete="one-time-code"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="reset-password">New Password</label>
                                <div className="auth-input-shell">
                                    <FaLock aria-hidden="true" />
                                    <input
                                        id="reset-password"
                                        type="password"
                                        name="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="reset-confirm">Confirm New Password</label>
                                <div className="auth-input-shell">
                                    <FaLock aria-hidden="true" />
                                    <input
                                        id="reset-confirm"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="auth-submit" type="submit" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>

                            {canResend ? (
                                <button type="button" className="auth-resend" onClick={handleResendCode}>
                                    Resend code
                                </button>
                            ) : (
                                <button type="button" className="auth-resend" disabled>
                                    Resend code ({resendSeconds}s)
                                </button>
                            )}
                        </form>
                    )}

                    {status && (
                        <p className={`auth-status ${/unable|fail|not found|invalid|expired|too many/i.test(status) ? "auth-status-error" : ""}`} role="status" aria-live="polite">
                            {status}
                        </p>
                    )}

                    {!status && step === "email" && (
                        <p className="auth-status" role="status" aria-live="polite">
                            {VAGUE_MESSAGE}
                        </p>
                    )}

                    <p className="auth-switch">
                        Remembered your password? <Link to={adminMode ? "/admin/login" : "/login"}>Sign in</Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
