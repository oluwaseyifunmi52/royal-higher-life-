import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authApi";
import DonationForm from "../Components/DonateForm.jsx";
import SocialLinks from "../Components/SocialLinks.jsx";

export default function Donate() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleAuthSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (isLogin) {
            setLoading(true);
            try {
                const res = await loginUser({ email, password });
                const token = res.data.token || res.data.data?.token;
                if (token) {
                    localStorage.setItem("token", token);
                }
                navigate("/dashboard");
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Login failed. Please check your credentials."
                );
            } finally {
                setLoading(false);
            }
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            setLoading(true);
            try {
                await registerUser({ firstName, lastName, email, phone, password });
                setSuccess("Account created successfully. Please log in.");
                setIsLogin(true);
                setError("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        "Registration failed. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }
    }

    function switchMode(nextMode) {
        setIsLogin(nextMode);
        setError("");
        setSuccess("");
    }

    return (
        <>
            <section id="auth-section" className="auth-container">
                <div className="auth-box">
                    <p className="auth-eyebrow">Royal Higher Life Ministries</p>
                    <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
                    <p>
                        {isLogin
                            ? "Sign in before giving, or continue with the donation form below."
                            : "Create an account to manage your giving and ministry updates."}
                    </p>

                    <div className="auth-actions">
                        <button
                            type="button"
                            className={!isLogin ? "active" : ""}
                            onClick={() => switchMode(false)}
                        >
                            Create Account
                        </button>
                        <button
                            type="button"
                            className={isLogin ? "active" : ""}
                            onClick={() => switchMode(true)}
                        >
                            Login
                        </button>
                    </div>

                    {error && (
                        <p className="auth-status error" role="alert" aria-live="assertive">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="auth-status success" role="status" aria-live="polite">
                            {success}
                        </p>
                    )}

                    {isLogin ? (
                        <form className="auth-form" onSubmit={handleAuthSubmit}>
                            <div className="auth-field">
                                <label htmlFor="donate-login-email">Email address</label>
                                <input
                                    id="donate-login-email"
                                    type="email"
                                    placeholder="Email Address"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="donate-login-password">Password</label>
                                <input
                                    id="donate-login-password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="auth-options">
                                <label className="auth-check">
                                    <input type="checkbox" /> Remember Me
                                </label>
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleAuthSubmit}>
                            <div className="auth-grid-2">
                                <div className="auth-field">
                                    <label htmlFor="donate-first-name">First name</label>
                                    <input
                                        id="donate-first-name"
                                        type="text"
                                        placeholder="First Name"
                                        autoComplete="given-name"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label htmlFor="donate-last-name">Last name</label>
                                    <input
                                        id="donate-last-name"
                                        type="text"
                                        placeholder="Last Name"
                                        autoComplete="family-name"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label htmlFor="donate-signup-email">Email address</label>
                                <input
                                    id="donate-signup-email"
                                    type="email"
                                    placeholder="Email Address"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="auth-field">
                                <label htmlFor="donate-phone">Phone number</label>
                                <input
                                    id="donate-phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    autoComplete="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="auth-grid-2">
                                <div className="auth-field">
                                    <label htmlFor="donate-signup-password">Password</label>
                                    <input
                                        id="donate-signup-password"
                                        type="password"
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="auth-field">
                                    <label htmlFor="donate-confirm-password">Confirm password</label>
                                    <input
                                        id="donate-confirm-password"
                                        type="password"
                                        placeholder="Confirm Password"
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <DonationForm />
            <SocialLinks />
        </>
    );
}
