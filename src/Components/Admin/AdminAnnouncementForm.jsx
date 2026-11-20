import { useState } from "react";
import { createAnnouncement, updateAnnouncement } from "../../services/adminService";

const initial = { title: "", content: "", priority: "normal", targetAudience: "all", imageUrl: "", isPublished: true, publishAt: "" };

export default function AdminAnnouncementForm({ announcement, onClose, onSaved }) {
  const [formData, setFormData] = useState({ ...initial, ...(announcement || {}), content: announcement?.content || announcement?.message || "", publishAt: announcement?.publishAt?.slice?.(0, 16) || "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const isEdit = Boolean(announcement?._id);
  const change = (event) => setFormData((prev) => ({ ...prev, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) { setError("Title and content are required."); return; }
    setStatus("loading"); setError("");
    try {
      const payload = { ...formData, publishAt: formData.publishAt || null };
      if (isEdit) await updateAnnouncement(announcement._id, payload);
      else await createAnnouncement(payload);
      setStatus("success");
      await onSaved?.();
      onClose();
    } catch (err) { setStatus("error"); setError(err.response?.data?.message || "Announcement could not be saved."); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="announcement-title">
        <div className="mb-5 flex items-center justify-between"><h2 id="announcement-title" className="text-xl font-bold text-slate-900">{isEdit ? "Edit announcement" : "New announcement"}</h2><button type="button" onClick={onClose} className="min-h-11 min-w-11 text-2xl" aria-label="Close">&times;</button></div>
        {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">Title<input name="title" value={formData.title} onChange={change} className="mt-1 w-full rounded border p-3" required /></label>
          <label className="block text-sm font-medium">Content<textarea name="content" value={formData.content} onChange={change} rows={5} className="mt-1 w-full rounded border p-3" required /></label>
          <label className="block text-sm font-medium">Priority<select name="priority" value={formData.priority} onChange={change} className="mt-1 w-full rounded border p-3"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
          <label className="block text-sm font-medium">Audience<select name="targetAudience" value={formData.targetAudience} onChange={change} className="mt-1 w-full rounded border p-3"><option value="all">Everyone</option><option value="members">Members</option><option value="volunteers">Volunteers</option><option value="partners">Partners</option></select></label>
          <label className="block text-sm font-medium">Related image URL (upload in the Media Library and copy its URL)<input type="url" name="imageUrl" value={formData.imageUrl || ""} onChange={change} className="mt-1 w-full rounded border p-3" /></label>
          <label className="block text-sm font-medium">Schedule (optional)<input type="datetime-local" name="publishAt" value={formData.publishAt || ""} onChange={change} className="mt-1 w-full rounded border p-3" /></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" checked={Boolean(formData.isPublished)} onChange={change} />Published (turn off to save as draft)</label>
          {status === "success" && <p role="status" className="text-sm text-green-700">Announcement saved.</p>}
          <div className="flex justify-end gap-3 border-t pt-4"><button type="button" onClick={onClose} className="min-h-11 rounded border px-4">Cancel</button><button type="submit" disabled={status === "loading"} className="min-h-11 rounded bg-blue-700 px-4 font-semibold text-white disabled:opacity-60">{status === "loading" ? "Saving…" : "Save announcement"}</button></div>
        </form>
      </section>
    </div>
  );
}
