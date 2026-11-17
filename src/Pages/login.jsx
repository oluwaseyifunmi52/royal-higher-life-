import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { loginUser, startSocialLogin, exchangeSocialLoginCode } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../services/authErrorMessage";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState("");

    const navigate = useNavigate();
    const { loginUser: saveLogin } = useAuth();

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const code = searchParams.get("social_code") || hashParams.get("social_code");
        const errorCode = searchParams.get("social_error") || hashParams.get("social_error");
        if (!code && !errorCode) return;

        // Remove the one-time code or provider error from browser history immediately.
        window.history.replaceState({}, "", window.location.pathname);

        const socialErrors = {
            cancelled: "Sign-in was cancelled. You can try again or use your email and password.",
            provider_denied: "The provider declined sign-in. Please try again or use your email and password.",
            invalid_state: "This sign-in attempt expired or could not be verified. Please try again.",
            invalid_callback: "The provider returned an invalid sign-in response. Please try again.",
            provider_not_supported: "That sign-in provider is not supported.",
            provider_error: "The provider could not complete sign-in. Please try again.",
            provider_response_invalid: "The provider returned an incomplete sign-in response.",
            provider_identity_unverified: "The provider could not verify this account. Please use another sign-in method.",
            provider_email_unavailable: "Facebook did not provide an email address for this account.",
            account_exists: "An account already uses this email. Sign in with that account; social accounts are not linked automatically.",
            account_disabled: "This account is currently unavailable. Please contact the ministry.",
            temporarily_unavailable: "Social sign-in is temporarily unavailable. Please try again.",
        };

        if (errorCode) {
            setStatus(socialErrors[errorCode] || "Social sign-in could not be completed. Please try again.");
            return;
        }

        let active = true;
        setSocialLoading("completing");
        setStatus("");
        exchangeSocialLoginCode(code)
            .then((response) => {
                const data = response.data?.data ?? response.data;
                if (!data?.token || !data?.user) throw new Error("The sign-in response was incomplete.");
                if (!active) return;
                saveLogin(data.token, data.user);
                navigate("/dashboard", { replace: true });
            })
            .catch((error) => {
                if (!active) return;
                console.warn("Social sign-in completion failed.", {
                    code: error.code || "unknown",
                    status: error.response?.status || "unknown",
                });
                const apiMessage = error.response?.data?.message;
                setStatus(apiMessage || "Unable to complete social sign-in. Please try again.");
            })
            .finally(() => {
                if (active) setSocialLoading("");
            });

        return () => { active = false; };
    }, [navigate, saveLogin]);

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
    }

    async function handleSocialLogin(provider) {
        if (socialLoading || loading) return;
        setSocialLoading(provider);
        setStatus("");
        try {
            const response = await startSocialLogin(provider);
            const authorizationUrl = response.data?.data?.authorizationUrl;
            if (typeof authorizationUrl !== "string") {
                throw new Error("The sign-in provider is not configured.");
            }
            window.location.assign(authorizationUrl);
        } catch (error) {
            console.warn("Social sign-in could not be started.", {
                code: error.code || "unknown",
                status: error.response?.status || "unknown",
            });
            const message = error.response?.status === 404
                ? "Social sign-in is unavailable on this server. Please use email and password or try again later."
                : error.response?.data?.message ||
                    (error.code === "ERR_NETWORK"
                        ? "Unable to connect to the sign-in service. Please try again."
                        : "Unable to start social sign-in. Please try again.");
            setStatus(message);
            setSocialLoading("");
        }
    }

    async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
        const res = await loginUser({
            email: form.email,
            password: form.password,
        });

        const responseData = res.data?.data ?? res.data;
        const token = responseData?.token;

        if (!token) {
            throw new Error("No token returned from the server.");
        }

        saveLogin(token, responseData.user ?? responseData.profile ?? null);

        setStatus("Login successful!");
        setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
        setStatus(getAuthErrorMessage(err, "login"));
    } finally {
        setLoading(false);
    }
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
                            <label htmlFor="login-email">Email Address</label>
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

                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="auth-socials">
                        <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("google")} disabled={Boolean(socialLoading || loading)}>
                            <FaGoogle aria-hidden="true" />
                            {socialLoading === "google" ? "Connecting..." : "Google"}
                        </button>
                        <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("facebook")} disabled={Boolean(socialLoading || loading)}>
                            <FaFacebookF aria-hidden="true" />
                            {socialLoading === "facebook" ? "Connecting..." : "Facebook"}
                        </button>
                    </div>

                    {status && (
                        <p className={`auth-status ${/fail|not match|please|error/i.test(status) ? "auth-status-error" : ""}`} role="status" aria-live="polite">
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
