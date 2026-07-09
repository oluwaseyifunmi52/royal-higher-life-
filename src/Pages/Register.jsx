import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaGlobe,
    FaLock,
    FaMapMarkerAlt,
    FaPhone,
    FaUser,
} from "react-icons/fa";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    gender: "",
    password: "",
    confirmPassword: "",
    newsletter: true,
    agree: false,
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [status, setStatus] = useState("");
    const [form, setForm] = useState(initialForm);

    const strength = useMemo(() => {
        let score = 0;

        if (form.password.length >= 8) score += 1;
        if (/[A-Z]/.test(form.password)) score += 1;
        if (/[0-9]/.test(form.password)) score += 1;
        if (/[^A-Za-z0-9]/.test(form.password)) score += 1;

        return score;
    }, [form.password]);

    const strengthText = ["Too short", "Weak", "Fair", "Good", "Strong"];

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setStatus("");
    }

    function submitHandler(e) {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setStatus("Passwords do not match. Please check both password fields.");
            return;
        }

        if (!form.agree) {
            setStatus("Please accept the account terms before creating your account.");
            return;
        }

        setStatus("Account details captured. Connect this form to your backend API when ready.");
    }

    return (
        <main className="auth-page auth-page-register">
            <section className="auth-hero" aria-labelledby="register-hero-title">
                <div className="auth-hero-content">
                    <p className="auth-eyebrow">Join The Family</p>
                    <h1 id="register-hero-title">Create your ministry account</h1>
                    <p>
                        Become part of a growing family dedicated to worship, outreach,
                        discipleship, and lives transformed through Christ.
                    </p>
                    <div className="auth-verse">
                        <strong>1 Corinthians 3:9</strong>
                        <span>For we are God's fellow workers.</span>
                    </div>
                </div>
            </section>

            <section className="auth-panel-wrap" aria-labelledby="register-title">
                <motion.form
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    onSubmit={submitHandler}
                    className="auth-panel auth-panel-wide"
                >
                    <div className="auth-heading">
                        <p className="auth-eyebrow">New Account</p>
                        <h2 id="register-title">Create Account</h2>
                        <p>Fill in your details to get started.</p>
                    </div>

                    <div className="auth-grid-2">
                        <AuthInput
                            id="register-first-name"
                            icon={<FaUser />}
                            label="First name"
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            autoComplete="given-name"
                            required
                        />
                        <AuthInput
                            id="register-last-name"
                            icon={<FaUser />}
                            label="Last name"
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            autoComplete="family-name"
                            required
                        />
                    </div>

                    <AuthInput
                        id="register-email"
                        icon={<FaEnvelope />}
                        label="Email address"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <AuthInput
                        id="register-phone"
                        icon={<FaPhone />}
                        label="Phone number"
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        required
                    />

                    <div className="auth-grid-2">
                        <AuthInput
                            id="register-country"
                            icon={<FaGlobe />}
                            label="Country"
                            name="country"
                            placeholder="Country"
                            value={form.country}
                            onChange={handleChange}
                            autoComplete="country-name"
                        />
                        <AuthInput
                            id="register-state"
                            icon={<FaMapMarkerAlt />}
                            label="State"
                            name="state"
                            placeholder="State"
                            value={form.state}
                            onChange={handleChange}
                            autoComplete="address-level1"
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-gender">Gender</label>
                        <select
                            id="register-gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="auth-grid-2">
                        <PasswordInput
                            id="register-password"
                            label="Password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            showPassword={showPassword}
                            onToggle={() => setShowPassword((current) => !current)}
                            required
                        />
                        <PasswordInput
                            id="register-confirm-password"
                            label="Confirm password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            showPassword={showConfirm}
                            onToggle={() => setShowConfirm((current) => !current)}
                            required
                        />
                    </div>

                    <div className="password-strength" aria-label="Password strength">
                        <div className="password-strength-track">
                            <span className={`password-strength-fill strength-${strength}`} />
                        </div>
                        <small>{strengthText[strength]}</small>
                    </div>

                    <div className="auth-check-list">
                        <label className="auth-check">
                            <input
                                type="checkbox"
                                name="newsletter"
                                checked={form.newsletter}
                                onChange={handleChange}
                            />
                            <span>Send me ministry updates and announcements</span>
                        </label>

                        <label className="auth-check">
                            <input
                                type="checkbox"
                                name="agree"
                                checked={form.agree}
                                onChange={handleChange}
                                required
                            />
                            <span>I agree to create a Royal Higher Life Ministries account</span>
                        </label>
                    </div>

                    <button className="auth-submit" type="submit">
                        Create Account
                    </button>

                    {status && (
                        <p className="auth-status" role="status" aria-live="polite">
                            {status}
                        </p>
                    )}

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </motion.form>
            </section>
        </main>
    );
}

function AuthInput({
    icon,
    id,
    label,
    type = "text",
    ...inputProps
}) {
    return (
        <div className="auth-field">
            <label htmlFor={id}>{label}</label>
            <div className="auth-input-shell">
                <span aria-hidden="true">{icon}</span>
                <input id={id} type={type} {...inputProps} />
            </div>
        </div>
    );
}

function PasswordInput({
    id,
    label,
    showPassword,
    onToggle,
    ...inputProps
}) {
    return (
        <div className="auth-field">
            <label htmlFor={id}>{label}</label>
            <div className="auth-input-shell">
                <FaLock aria-hidden="true" />
                <input id={id} type={showPassword ? "text" : "password"} {...inputProps} />
                <button
                    type="button"
                    className="auth-icon-button"
                    onClick={onToggle}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
        </div>
    );
}
