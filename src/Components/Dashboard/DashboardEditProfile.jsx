import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../services/authApi.js";

export default function DashboardEditProfile() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        country: "",
        state: "",
        gender: "",
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await getProfile();
                const profile = res.data;
                setForm({
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    phone: profile.phone || "",
                    country: profile.country || "",
                    state: profile.state || "",
                    gender: profile.gender || "",
                });
            } catch (error) {
                setStatus({ type: "error", text: error.message });
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus({ type: "loading", text: "Updating profile..." });

        try {
            await updateProfile(form);
            setStatus({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            setStatus({ type: "error", text: error.message });
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading profile...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                        </label>
                        <input
                            id="country"
                            name="country"
                            type="text"
                            value={form.country}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <input
                            id="state"
                            name="state"
                            type="text"
                            value={form.state}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>
                            -- Select Gender --
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={status?.type === "loading"}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {status?.type === "loading" ? "Updating..." : "Update Profile"}
                </button>
                {status && (
                    <div
                        className={`p-3 rounded-md ${
                            status.type === "success"
                                ? "bg-green-100 text-green-700"
                                : status.type === "error"
                                ? "bg-red-100 text-red-700"
                                : ""
                        }`}
                        role="status"
                        aria-live="polite"
                    >
                        {status.text}
                    </div>
                )}
            </form>
        </div>
    );
}
