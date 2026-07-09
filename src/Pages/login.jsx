import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaChurch,
    FaEnvelope,
    FaFacebookF,
    FaGoogle,
    FaLock,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
        remember: false,
    });

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setStatus("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        setStatus("Login details captured. Connect this form to your backend API when ready.");
    }

    return (
        <main className="auth-page">
            <section className="auth-hero" aria-labelledby="login-hero-title">
                <div className="auth-hero-content">
                    <FaChurch className="auth-hero-icon" aria-hidden="true" />
                    <p className="auth-eyebrow">Royal Higher Life Ministries</p>
                    <h1 id="login-hero-title">Welcome back</h1>
                    <p>
                        Sign in to manage donations, prayer requests, ministry events,
                        and your member dashboard.
                    </p>
                    <div className="auth-verse">
                        <strong>Luke 6:38</strong>
                        <span>Give, and it will be given to you.</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel-wrap" aria-labelledby="login-title">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    className="auth-panel"
                >
                    <div className="auth-heading">
                        <p className="auth-eyebrow">Member Access</p>
                        <h2 id="login-title">Sign in</h2>
                        <p>Use your account details to continue.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="login-email">Email address</label>
                            <div className="auth-input-shell">
                                <FaEnvelope aria-hidden="true" />
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="login-password">Password</label>
                            <div className="auth-input-shell">
                                <FaLock aria-hidden="true" />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-icon-button"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="auth-options">
                            <label className="auth-check">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={form.remember}
                                    onChange={handleChange}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        <button className="auth-submit" type="submit">
                            Sign In
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="auth-socials">
                        <button type="button" className="auth-social-btn">
                            <FaGoogle aria-hidden="true" />
                            Google
                        </button>
                        <button type="button" className="auth-social-btn">
                            <FaFacebookF aria-hidden="true" />
                            Facebook
                        </button>
                    </div>

                    {status && (
                        <p className="auth-status" role="status" aria-live="polite">
                            {status}
                        </p>
                    )}

                    <p className="auth-switch">
                        Don't have an account? <Link to="/register">Create account</Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
