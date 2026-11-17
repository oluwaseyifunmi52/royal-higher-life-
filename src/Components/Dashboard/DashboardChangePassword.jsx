import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { changePassword } from "../../services/authApi.js";

export default function DashboardChangePassword() {
    const [status, setStatus] = useState(null);
    const [visible, setVisible] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            setStatus({ type: "error", text: "New passwords do not match." });
            return;
        }

        setStatus({ type: "loading", text: "Changing password..." });

        try {
            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setStatus({ type: "success", text: "Password changed successfully!" });
        } catch (error) {
            setStatus({ type: "error", text: error.message });
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </label>
                    <div className="auth-input-shell">
                    <FaLock aria-hidden="true" />
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type={visible.currentPassword ? "text" : "password"}
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="auth-icon-button" onClick={() => setVisible((state) => ({ ...state, currentPassword: !state.currentPassword }))} aria-label={visible.currentPassword ? "Hide current password" : "Show current password"}>{visible.currentPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <div className="auth-input-shell">
                    <FaLock aria-hidden="true" />
                    <input
                        id="newPassword"
                        name="newPassword"
                        type={visible.newPassword ? "text" : "password"}
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="auth-icon-button" onClick={() => setVisible((state) => ({ ...state, newPassword: !state.newPassword }))} aria-label={visible.newPassword ? "Hide new password" : "Show new password"}>{visible.newPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <div className="auth-input-shell">
                    <FaLock aria-hidden="true" />
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={visible.confirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="auth-icon-button" onClick={() => setVisible((state) => ({ ...state, confirmPassword: !state.confirmPassword }))} aria-label={visible.confirmPassword ? "Hide confirmation password" : "Show confirmation password"}>{visible.confirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={status?.type === "loading"}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {status?.type === "loading" ? "Changing..." : "Change Password"}
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
