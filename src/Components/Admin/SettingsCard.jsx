import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Save,
    RotateCcw,
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    CreditCard,
    Bell,
    Shield,
} from "lucide-react";
import { CURRENCY_OPTIONS } from "../../utils/currency";

export default function SettingsCard() {
    const [feedback, setFeedback] = useState("");
    const [settings, setSettings] = useState({
        churchName: "Royal Higher Life Ministries",
        email: "info@royalhigherlife.org",
        phone: "+234 801 234 5678",
        address: "Lagos, Nigeria",
        currency: "NGN",
        timezone: "Africa/Lagos",
        language: "English",
        emailNotification: true,
        smsNotification: false,
        twoFactor: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const saveSettings = () => {
        setFeedback(
            "Display preferences are not persisted by this screen. Payment providers and donation currencies are configured securely on the server."
        );
    };

    const resetSettings = () => {
        window.location.reload();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200"
        >
            {/* Header */}

            <div className="flex justify-between items-center p-6 border-b">

                <div className="flex items-center gap-3">

                    <Settings
                        size={28}
                        className="text-green-700"
                    />

                    <div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            System Settings
                        </h2>

                        <p className="text-gray-500">
                            Configure church preferences
                        </p>

                    </div>

                </div>

            </div>

            {/* Form */}

            <div className="grid md:grid-cols-2 gap-6 p-6">

                {/* Church Name */}

                <div>

                    <label className="font-semibold flex gap-2 items-center mb-2">
                        <Building2 size={18} />
                        Church Name
                    </label>

                    <input
                        type="text"
                        name="churchName"
                        value={settings.churchName}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                    />

                </div>

                {/* Email */}

                <div>

                    <label className="font-semibold flex gap-2 items-center mb-2">
                        <Mail size={18} />
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={settings.email}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                    />

                </div>

                {/* Phone */}

                <div>

                    <label className="font-semibold flex gap-2 items-center mb-2">
                        <Phone size={18} />
                        Phone
                    </label>

                    <input
                        type="text"
                        name="phone"
                        value={settings.phone}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                    />

                </div>

                {/* Address */}

                <div>

                    <label className="font-semibold flex gap-2 items-center mb-2">
                        <MapPin size={18} />
                        Address
                    </label>

                    <input
                        type="text"
                        name="address"
                        value={settings.address}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none"
                    />

                </div>

                {/* Currency */}

                <div>

                    <label className="font-semibold flex gap-2 items-center mb-2">
                        <CreditCard size={18} />
                        Currency
                    </label>

                    <select
                        name="currency"
                        value={settings.currency}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        {CURRENCY_OPTIONS.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                                {currency.code} — {currency.name}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Timezone */}

                <div>

                    <label className="font-semibold flex gap-2 items-center mb-2">
                        <Globe size={18} />
                        Timezone
                    </label>

                    <select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3"
                    >
                        <option>Africa/Lagos</option>
                        <option>Europe/London</option>
                        <option>America/New_York</option>
                    </select>

                </div>

            </div>

            {/* Notifications */}

            <div className="border-t p-6">

                <h3 className="font-bold text-xl mb-5">
                    Notifications & Security
                </h3>

                <div className="space-y-5">

                    <label className="flex justify-between items-center">

                        <span className="flex gap-2 items-center">

                            <Bell size={18} />

                            Email Notifications

                        </span>

                        <input
                            type="checkbox"
                            name="emailNotification"
                            checked={settings.emailNotification}
                            onChange={handleChange}
                        />

                    </label>

                    <label className="flex justify-between items-center">

                        <span className="flex gap-2 items-center">

                            <Bell size={18} />

                            SMS Notifications

                        </span>

                        <input
                            type="checkbox"
                            name="smsNotification"
                            checked={settings.smsNotification}
                            onChange={handleChange}
                        />

                    </label>

                    <label className="flex justify-between items-center">

                        <span className="flex gap-2 items-center">

                            <Shield size={18} />

                            Two Factor Authentication

                        </span>

                        <input
                            type="checkbox"
                            name="twoFactor"
                            checked={settings.twoFactor}
                            onChange={handleChange}
                        />

                    </label>

                    <label className="flex justify-between items-center">
                        <span className="flex gap-2 items-center">
                            <CreditCard size={18} />
                            Payment providers
                        </span>
                        <span className="text-sm text-gray-500">
                            Configured server-side
                        </span>
                    </label>

                </div>
                <p className="mt-4 text-sm text-gray-500">
                    Donation currencies and payment providers are enabled only through secure
                    server environment variables. Secret keys are never sent to the browser.
                </p>

            </div>

            {/* Footer */}

            <div className="border-t p-6 flex flex-wrap items-center justify-between gap-4">
                {feedback ? (
                    <p role="status" className="text-sm text-gray-600">
                        {feedback}
                    </p>
                ) : (
                    <span />
                )}
                <div className="flex gap-4">
                    <button
                        onClick={resetSettings}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>
                    <button
                        onClick={saveSettings}
                        className="flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl transition"
                    >
                        <Save size={18} />
                        Save Preferences
                    </button>
                </div>
            </div>
        </motion.div>
    );
}