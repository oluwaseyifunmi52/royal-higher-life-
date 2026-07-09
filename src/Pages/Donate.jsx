import { useState } from "react";
import DonationForm from "../Components/DonateForm.jsx";
import SocialLinks from "../Components/SocialLinks.jsx";

export default function Donate() {
    const [isLogin, setIsLogin] = useState(true);
    const [status, setStatus] = useState("");

    function handleAuthSubmit(e) {
        e.preventDefault();
        setStatus(
            isLogin
                ? "Login details captured. Connect this form to your backend API when ready."
                : "Account details captured. Connect this form to your backend API when ready."
        );
    }

    function switchMode(nextMode) {
        setIsLogin(nextMode);
        setStatus("");
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
                                />
                            </div>
                            <div className="auth-options">
                                <label className="auth-check">
                                    <input type="checkbox" /> Remember Me
                                </label>
                                <a href="#">Forgot Password?</a>
                            </div>
                            <button type="submit" className="submit-btn">
                                Login
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
                                    />
                                </div>
                            </div>
                            <button type="submit" className="submit-btn">
                                Create Account
                            </button>
                        </form>
                    )}

                    {status && (
                        <p className="auth-status" role="status" aria-live="polite">
                            {status}
                        </p>
                    )}
                </div>
            </section>

            <DonationForm />
            <SocialLinks />
        </>
    );
}
