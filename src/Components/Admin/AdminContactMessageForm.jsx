import { useState, useEffect } from "react";
import {
  updateContactMessage,
  retryContactNotification,
} from "../../services/adminService";

const INITIAL_STATE = {
  name: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
  status: "unread",
  internalNotes: "",
};

export default function AdminContactMessageForm({ contactMessage, onClose, onSaved }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [retryingNotification, setRetryingNotification] = useState(false);

  const isEdit = Boolean(contactMessage);

  useEffect(() => {
    if (contactMessage) {
      setFormData({
        name: contactMessage.name || "",
        email: contactMessage.email || "",
        subject: contactMessage.subject || "",
        message: contactMessage.message || "",
        phone: contactMessage.phone || "",
        status: contactMessage.status || "unread",
        internalNotes: contactMessage.internalNotes || "",
      });
    }
  }, [contactMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Please enter a valid email address";
    if (!formData.message.trim()) return "Message is required";
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
        await updateContactMessage(contactMessage._id, { status: formData.status, internalNotes: formData.internalNotes });
      } else {
        setError("Creating new contact messages not supported. Users submit via the website.");
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
    if (!contactMessage?._id || retryingNotification) return;
    setRetryingNotification(true);
    setError("");
    try {
      await retryContactNotification(contactMessage._id);
      if (onSaved) await onSaved();
      onClose();
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
            {isEdit ? "Edit Contact Message" : "View Contact Message"}
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
              Contact message {isEdit ? "updated" : "created"} successfully!
            </div>
          )}

          {error && status !== "success" && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p><strong>Reference:</strong> {contactMessage?.reference || "Legacy message"}</p>
            <p><strong>Submitted:</strong> {contactMessage?.createdAt ? new Date(contactMessage.createdAt).toLocaleString() : "—"}</p>
            <p><strong>Ministry notification:</strong> {(contactMessage?.notificationQueueStatus || contactMessage?.notificationStatus || "pending").replace(/^./, (letter) => letter.toUpperCase())}</p>
            <p><strong>Provider delivery:</strong> {contactMessage?.notificationDeliveryStatus || "Unknown"}</p>
            {contactMessage?.notificationProviderId && <p><strong>Provider message ID:</strong> {contactMessage.notificationProviderId}</p>}
            {contactMessage?.notificationAttemptCount > 0 && <p><strong>Attempts:</strong> {contactMessage.notificationAttemptCount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" name="phone" value={formData.phone} readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Message subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              readOnly
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Message content"
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
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="resolved">Resolved</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="contactInternalNotes">Internal follow-up notes</label>
            <textarea id="contactInternalNotes" name="internalNotes" value={formData.internalNotes} onChange={handleChange} rows={4} maxLength={5000} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            {isEdit && contactMessage?.notificationQueueStatus === "failed" && (
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
                ? "Update Contact Message"
                : "Create Contact Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
