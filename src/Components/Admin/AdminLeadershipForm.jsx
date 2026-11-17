import { useState, useEffect } from "react";
import {
  createLeadership,
  updateLeadership,
} from "../../services/adminService";

const INITIAL_STATE = {
  name: "",
  title: "",
  bio: "",
  image: "",
  responsibilities: "",
  isPastor: false,
};

export default function AdminLeadershipForm({ leadership, onClose }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const isEdit = Boolean(leadership);

  useEffect(() => {
    if (leadership) {
      setFormData({
        name: leadership.name || "",
        title: leadership.title || "",
        bio: leadership.bio || "",
        image: leadership.image || "",
        responsibilities: Array.isArray(leadership.responsibilities) 
          ? leadership.responsibilities.join("\n") 
          : leadership.responsibilities || "",
        isPastor: leadership.isPastor || false,
      });
    }
  }, [leadership]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.title.trim()) return "Title is required";
    if (!formData.bio.trim()) return "Biography is required";
    if (formData.image && !/^https?:\/\/.+/.test(formData.image)) return "Please enter a valid image URL";
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
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.split("\n").filter(r => r.trim()),
      };

      if (isEdit) {
        await updateLeadership(leadership._id, payload);
      } else {
        await createLeadership(payload);
      }
      setStatus("success");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Leadership Member" : "Add Leadership Member"}
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
              Leadership member {isEdit ? "updated" : "created"} successfully!
            </div>
          )}

          {error && status !== "success" && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Senior Pastor, Associate Pastor, Elder"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biography *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter biography"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsibilities (one per line)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Vision casting and strategic leadership&#10;Preaching and teaching ministry&#10;Overseeing church planting"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPastor"
              checked={formData.isPastor}
              onChange={handleChange}
              id="isPastor"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPastor" className="text-sm font-medium text-gray-700">
              Senior Pastor / Founder
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? "Saving..."
                : isEdit
                ? "Update Leadership Member"
                : "Create Leadership Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}