import { useState, useEffect } from "react";
import {
  createSermon,
  updateSermon,
} from "../../services/adminService";

const INITIAL_STATE = {
  title: "",
  speaker: "",
  description: "",
  scripture: "",
  date: "",
  videoUrl: "",
  imageUrl: "",
  category: "Sunday Service",
  isPublished: true,
  publishAt: "",
  isFeatured: false,
};

export default function AdminSermonForm({ sermon, onClose }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const isEdit = Boolean(sermon);

  useEffect(() => {
    if (sermon) {
      setFormData({
        title: sermon.title || "",
        speaker: sermon.speaker || sermon.preacher || "",
        description: sermon.description || "",
        scripture: sermon.scripture || "",
        date: (sermon.sermonDate || sermon.date) ? (sermon.sermonDate || sermon.date).slice(0, 10) : "",
        videoUrl: sermon.videoUrl || "",
        imageUrl: sermon.imageUrl || sermon.image || "",
        category: sermon.category || "Sunday Service",
        isPublished: sermon.isPublished !== false,
        publishAt: sermon.publishAt ? sermon.publishAt.slice(0, 16) : "",
        isFeatured: Boolean(sermon.isFeatured),
      });
    }
  }, [sermon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.speaker.trim()) return "Speaker is required";
    if (!formData.date) return "Date is required";
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
        await updateSermon(sermon._id, { ...formData, publishAt: formData.publishAt || null });
      } else {
        await createSermon({ ...formData, publishAt: formData.publishAt || null });
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
            {isEdit ? "Edit Sermon" : "Add New Sermon"}
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
              Sermon {isEdit ? "updated" : "created"} successfully!
            </div>
          )}

          {error && status !== "success" && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              placeholder="Enter sermon title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speaker *
            </label>
            <input
              type="text"
              name="speaker"
              value={formData.speaker}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter speaker name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter sermon description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scripture
              </label>
              <input
                type="text"
                name="scripture"
                value={formData.scripture}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g. John 3:16"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
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
              <option>Sunday Service</option>
              <option>Bible Study</option>
              <option>Youth</option>
              <option>Special</option>
              <option>Guest Speaker</option>
            </select>
          </div>
          <label className="block text-sm font-medium text-gray-700">Schedule publication (optional)<input type="datetime-local" name="publishAt" value={formData.publishAt} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" /></label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={formData.isPublished} onChange={(event) => setFormData((prev) => ({ ...prev, isPublished: event.target.checked }))} />Published (turn off to save a draft)</label>
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={formData.isFeatured} onChange={(event) => setFormData((prev) => ({ ...prev, isFeatured: event.target.checked }))} />Feature this sermon</label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
            />
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
                ? "Update Sermon"
                : "Create Sermon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
