import { useEffect, useState } from "react";
import { uploadGalleryImage } from "../../services/adminService";

export default function AdminGalleryForm({ onClose }) {
    const [form, setForm] = useState({ title: "", category: "General", description: "" });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!imageFile) { setPreview(""); return undefined; }
        const previewUrl = URL.createObjectURL(imageFile);
        setPreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [imageFile]);

    const submit = async (event) => {
        event.preventDefault();
        if (!form.title.trim() || !imageFile) {
            setError("Add a title and choose an image file.");
            return;
        }
        const payload = new FormData();
        payload.append("title", form.title.trim());
        payload.append("category", form.category);
        payload.append("description", form.description.trim());
        payload.append("image", imageFile);
        setSaving(true);
        setError("");
        try {
            await uploadGalleryImage(payload);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "The image could not be uploaded.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="gallery-form-title">
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="gallery-form-title" className="text-xl font-bold text-slate-900">Upload gallery image</h2>
                    <button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded text-2xl text-slate-600" aria-label="Close">&times;</button>
                </div>
                {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
                <form onSubmit={submit} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Title<input className="mt-1 w-full rounded border p-3" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
                    <label className="block text-sm font-medium text-slate-700">Image file<input className="mt-1 block w-full rounded border p-3" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} required /></label>
                    {preview && <img src={preview} alt="Selected image preview" className="max-h-64 w-full rounded-lg object-contain" />}
                    <label className="block text-sm font-medium text-slate-700">Category<select className="mt-1 w-full rounded border p-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>General</option><option>Sunday Service</option><option>Youth</option><option>Outreach</option><option>Events</option><option>Fellowship</option><option>Baptism</option><option>Camp</option></select></label>
                    <label className="block text-sm font-medium text-slate-700">Description<textarea className="mt-1 w-full rounded border p-3" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <button type="button" onClick={onClose} className="min-h-11 rounded border px-4">Cancel</button>
                        <button type="submit" disabled={saving} className="min-h-11 rounded bg-blue-700 px-4 font-semibold text-white disabled:opacity-60">{saving ? "Uploading…" : "Upload image"}</button>
                    </div>
                </form>
            </section>
        </div>
    );
}
