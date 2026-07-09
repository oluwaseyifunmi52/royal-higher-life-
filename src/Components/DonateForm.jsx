import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaLock,
    FaCreditCard,
    FaUniversity,
    FaMobileAlt,
    FaReceipt,
} from "react-icons/fa";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    currency: "NGN",
    purpose: "General Offering",
    message: "",
    anonymous: false,
    payment: "paystack",
};

const amountOptions = ["5000", "10000", "25000", "50000", "100000"];

const currencies = [
    "NGN",
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "GHS",
];

const purposes = [
    "General Offering",
    "Church Planting",
    "Building Project",
    "Evangelism",
    "Mission Outreach",
    "Youth Ministry",
    "Children Ministry",
    "Bible Distribution",
    "Medical Outreach",
    "Community Support",
];

const paymentMethods = [
    {
        id: "paystack",
        title: "Paystack",
        icon: <FaCreditCard />,
    },
    {
        id: "flutterwave",
        title: "Flutterwave",
        icon: <FaCreditCard />,
    },
    {
        id: "bank",
        title: "Bank Transfer",
        icon: <FaUniversity />,
    },
    {
        id: "ussd",
        title: "USSD",
        icon: <FaMobileAlt />,
    },
];

export default function DonationForm() {
    const [form, setForm] = useState(initialForm);
    const [isSubmitted, setIsSubmitted] = useState(false);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setIsSubmitted(false);
    }

    function handleAmountSelect(amount) {
        setForm((prev) => ({
            ...prev,
            amount,
        }));
        setIsSubmitted(false);
    }

    function submitHandler(e) {
        e.preventDefault();

        setIsSubmitted(true);
    }

    return (
        <section className="donation-section" aria-labelledby="donation-heading">
            <div className="donation-container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: .6 }}
                    className="donation-grid"
                >
                    <div className="donation-left">
                        <p className="donation-subtitle">Donation Form</p>
                        <h2 className="donation-title" id="donation-heading">
                            Support God's Work
                        </h2>
                        <p className="donation-description">
                            Every contribution helps Royal Higher Life Ministries
                            spread the Gospel, support missions, care for communities,
                            and impact lives around the world.
                        </p>

                        <div className="security-list" aria-label="Donation security benefits">
                            <div className="security-item">
                                <FaLock aria-hidden="true" />
                                <span>256-bit Secure Encryption</span>
                            </div>
                            <div className="security-item">
                                <FaCreditCard aria-hidden="true" />
                                <span>Trusted Payment Gateway</span>
                            </div>
                            <div className="security-item">
                                <FaReceipt aria-hidden="true" />
                                <span>Instant Donation Receipt</span>
                            </div>
                        </div>
                    </div>

                    <motion.form
                        onSubmit={submitHandler}
                        initial={{ opacity: 0, scale: .95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: .5 }}
                        className="donation-form"
                    >
                        <h3 className="form-title">
                            Complete Your Donation
                        </h3>

                        <div className="form-grid-2">
                            <div className="field-group">
                                <label className="field-label" htmlFor="firstName">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    autoComplete="given-name"
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="lastName">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    autoComplete="family-name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="field-group">
                                <label className="field-label" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="phone">
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid-2">
                            <div className="field-group">
                                <label className="field-label" htmlFor="amount">
                                    Donation amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    placeholder="Donation Amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    min="1"
                                    step="0.01"
                                    inputMode="decimal"
                                    required
                                />
                            </div>
                            <div className="field-group">
                                <label className="field-label" htmlFor="currency">
                                    Currency
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={form.currency}
                                    onChange={handleChange}
                                >
                                    {currencies.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="amount-grid" aria-label="Suggested donation amounts">
                            {amountOptions.map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    className={`amount-btn ${form.amount === amount ? "active" : ""}`}
                                    onClick={() => handleAmountSelect(amount)}
                                >
                                    {form.currency} {Number(amount).toLocaleString()}
                                </button>
                            ))}
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="purpose">
                                Donation purpose
                            </label>
                            <select
                                id="purpose"
                                name="purpose"
                                value={form.purpose}
                                onChange={handleChange}
                            >
                                {purposes.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label className="field-label" htmlFor="message">
                                Message or prayer request
                            </label>
                            <textarea
                                id="message"
                                rows="5"
                                name="message"
                                placeholder="Leave a message or prayer request..."
                                value={form.message}
                                onChange={handleChange}
                            />
                        </div>

                        <label className="checkbox-row" htmlFor="anonymous">
                            <input
                                id="anonymous"
                                type="checkbox"
                                name="anonymous"
                                checked={form.anonymous}
                                onChange={handleChange}
                            />
                            <span>Donate anonymously</span>
                        </label>

                        <h4 className="payment-title">Payment Method</h4>
                        <div className="payment-grid">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className={`payment-card ${form.payment === method.id ? "active" : ""}`}
                                >
                                    <input
                                        className="payment-radio"
                                        type="radio"
                                        name="payment"
                                        value={method.id}
                                        checked={form.payment === method.id}
                                        onChange={handleChange}
                                    />
                                    {method.icon}
                                    <span>{method.title}</span>
                                </label>
                            ))}
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: .98 }}
                            className="donate-btn"
                        >
                            Continue to Payment
                        </motion.button>

                        {isSubmitted && (
                            <p className="donation-status" role="status" aria-live="polite">
                                Thank you. Your donation details are ready for secure payment
                                processing.
                            </p>
                        )}
                    </motion.form>
                </motion.div>
            </div>
        </section>
    );
}
