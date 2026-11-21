import { useState, useEffect } from "react";
import {
  updatePrayerRequest,
  retryPrayerNotification,
} from "../../services/adminService";

const INITIAL_STATE = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  prayer: "",
  category: "General Prayer",
  status: "pending",
  internalNotes: "",
};

export default function AdminPrayerRequestForm({ prayerRequest, onClose, onSaved }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [retryingNotification, setRetryingNotification] = useState(false);

  const isEdit = Boolean(prayerRequest);

  useEffect(() => {
    if (prayerRequest) {
      setFormData({
        firstname: prayerRequest.firstname || (prayerRequest.name || "").split(" ")[0],
        lastname: prayerRequest.lastname || (prayerRequest.name || "").split(" ").slice(1).join(" "),
        email: prayerRequest.email || "",
        phone: prayerRequest.phone || "",
        prayer: prayerRequest.prayer || prayerRequest.request || "",
        category: prayerRequest.category || "General Prayer",
        status: prayerRequest.status || (prayerRequest.isAnswered ? "completed" : "pending"),
        internalNotes: prayerRequest.internalNotes || "",
      });
    }
  }, [prayerRequest]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.firstname.trim()) return "First name is required";
    if (!formData.lastname.trim()) return "Last name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Please enter a valid email address";
    if (!formData.prayer.trim()) return "Prayer request is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus("loading");
    setError("");

    try {
      if (isEdit) {
        await updatePrayerRequest(prayerRequest._id, { status: formData.status, category: formData.category, internalNotes: formData.internalNotes });
      } else {
        setError("Creating new prayer requests not supported. Users submit via the website.");
        setStatus("error");
        return;
      }
      setStatus("success");
      if (onSaved) await onSaved();
      else setTimeout(() => onClose(), 1200);
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleRetryNotification = async () => {
    if (!prayerRequest?._id || retryingNotification) return;
    setRetryingNotification(true);
    setError("");
    try {
      await retryPrayerNotification(prayerRequest._id);
      if (onSaved) await onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not retry the ministry notification.");
    } finally {
      setRetryingNotification(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Prayer Request" : "View Prayer Request"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status === "success" && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              Prayer request {isEdit ? "updated" : "created"} successfully!
            </div>
          )}

          {error && status !== "success" && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p><strong>Reference:</strong> {prayerRequest?.reference || "Legacy request"}</p>
            <p><strong>Submitted:</strong> {prayerRequest?.createdAt ? new Date(prayerRequest.createdAt).toLocaleString() : "—"}</p>
            <p><strong>Email notifications:</strong> {prayerRequest?.notificationStatus || "Unknown"}{prayerRequest?.notificationFailure ? ` (${prayerRequest.notificationFailure})` : ""}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="Healing">Healing</option>
              <option value="Financial Breakthrough">Financial Breakthrough</option>
              <option value="Family">Family</option>
              <option value="Spiritual Growth">Spiritual Growth</option>
              <option value="General Prayer">General Prayer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prayer Request *
            </label>
            <textarea
              name="prayer"
              value={formData.prayer}
              onChange={handleChange}
              readOnly
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Prayer request details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="praying">Being Prayed For</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prayerInternalNotes">Internal follow-up notes</label>
            <textarea id="prayerInternalNotes" name="internalNotes" value={formData.internalNotes} onChange={handleChange} rows={4} maxLength={5000} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            {prayerRequest?.notificationStatus !== "accepted" && (
              <button type="button" onClick={handleRetryNotification} disabled={retryingNotification} className="flex-1 px-4 py-2 border border-amber-500 rounded-lg text-amber-800 hover:bg-amber-50 font-medium disabled:opacity-50">
                {retryingNotification ? "Retrying..." : "Retry ministry notification"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "loading" || !isEdit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? "Saving..."
                : isEdit
                ? "Update Prayer Request"
                : "Create Prayer Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
