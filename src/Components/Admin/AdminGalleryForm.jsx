import { useEffect, useState } from "react";
import { getGalleryImages, updateGalleryImage, uploadGalleryImage } from "../../services/adminService";

const MAX_FILES = 8;
const MAX_BYTES = 50 * 1024 * 1024;
const emptyForm = { title: "", category: "General", description: "", altText: "", album: "", videoUrl: "", thumbnailUrl: "", isPublished: true, isFeatured: false, sortOrder: 0 };

export default function AdminGalleryForm({ image, onClose, onSaved }) {
    const [form, setForm] = useState({ ...emptyForm, ...(image || {}) });
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [progress, setProgress] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [library, setLibrary] = useState([]);
    const [reuseId, setReuseId] = useState("");

    useEffect(() => { getGalleryImages().then((response) => setLibrary((response.data?.data || []).filter((item) => item._id !== image?._id))).catch(() => {}); }, [image?._id]);

    useEffect(() => {
        const urls = files.filter((file) => file.type.startsWith("image/")).map((file) => URL.createObjectURL(file));
        setPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [files]);

    const submit = async (event) => {
        event.preventDefault();
        if (!image && !files.length && !form.videoUrl.trim()) {
            setError("Choose one or more media files, or provide a YouTube or Vimeo link.");
            return;
        }
        if (files.length > MAX_FILES || files.some((file) => file.size > MAX_BYTES)) {
            setError("Select up to 8 files, each no larger than 50 MB (combined limit 160 MB).");
            return;
        }
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => payload.append(key, String(value ?? "")));
        files.forEach((file) => payload.append("files", file));
        const reused = library.find((item) => item._id === reuseId);
        if (reused && !image) {
            payload.append("reuseMediaUrl", reused.mediaType === "image" ? reused.imageUrl : reused.videoUrl);
            payload.append("reuseMediaType", reused.mediaType || "image");
            payload.append("reuseMediaMimeType", reused.mimeType || "");
            if (!form.title) payload.set("title", reused.title || "");
        }
        setSaving(true);
        setError("");
        setProgress(0);
        const config = { onUploadProgress: (event) => event.total && setProgress(Math.round((event.loaded * 100) / event.total)) };
        try {
            if (image?._id) await updateGalleryImage(image._id, payload, config.onUploadProgress);
            else await uploadGalleryImage(payload, config.onUploadProgress);
            await onSaved?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "The media could not be saved. Check the file type and Cloudinary configuration.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="gallery-form-title">
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="gallery-form-title" className="text-xl font-bold text-slate-900">{image ? "Edit media" : "Add to media library"}</h2>
                    <button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded text-2xl text-slate-600" aria-label="Close">&times;</button>
                </div>
                {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
                <form onSubmit={submit} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Title<input className="mt-1 w-full rounded border p-3" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
                    <label className="block text-sm font-medium text-slate-700">Upload pictures, videos, or audio<input className="mt-1 block w-full rounded border p-3" type="file" multiple={!image} accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/webm,audio/mpeg,audio/wav,audio/mp4" onChange={(event) => setFiles(Array.from(event.target.files || []))} /></label>
                    {!image && library.length > 0 && <label className="block text-sm font-medium text-slate-700">Or reuse media from this library<select className="mt-1 w-full rounded border p-3" value={reuseId} onChange={(event) => setReuseId(event.target.value)}><option value="">Upload new media instead</option>{library.map((item) => <option key={item._id} value={item._id}>{item.title} · {item.mediaType || "image"}{item.album ? ` · ${item.album}` : ""}</option>)}</select></label>}
                    {previews.length > 0 && <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{previews.map((url) => <img key={url} src={url} alt="Selected image preview" className="h-28 w-full rounded-lg object-cover" />)}</div>}
                    {image?.imageUrl && !files.length && <img src={image.imageUrl} alt={image.altText || image.title || "Current media"} className="max-h-56 w-full rounded-lg object-contain" />}
                    <label className="block text-sm font-medium text-slate-700">YouTube or Vimeo URL<input className="mt-1 w-full rounded border p-3" type="url" placeholder="https://youtu.be/..." value={form.videoUrl || ""} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} /></label>
                    <label className="block text-sm font-medium text-slate-700">Album / collection<input className="mt-1 w-full rounded border p-3" value={form.album || ""} onChange={(event) => setForm({ ...form, album: event.target.value })} /></label>
                    <label className="block text-sm font-medium text-slate-700">Category<select className="mt-1 w-full rounded border p-3" value={form.category || "General"} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>General</option><option>Sunday Service</option><option>Youth</option><option>Outreach</option><option>Events</option><option>Fellowship</option><option>Baptism</option><option>Camp</option></select></label>
                    <label className="block text-sm font-medium text-slate-700">Description / caption<textarea className="mt-1 w-full rounded border p-3" rows={3} value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
                    <label className="block text-sm font-medium text-slate-700">Alternative text<input className="mt-1 w-full rounded border p-3" value={form.altText || ""} onChange={(event) => setForm({ ...form, altText: event.target.value })} /></label>
                    <label className="block text-sm font-medium text-slate-700">Video thumbnail URL<input type="url" className="mt-1 w-full rounded border p-3" value={form.thumbnailUrl || ""} onChange={(event) => setForm({ ...form, thumbnailUrl: event.target.value })} /></label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.isFeatured)} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} />Feature this media item</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.isPublished)} onChange={(event) => setForm({ ...form, isPublished: event.target.checked })} />Published on the public gallery</label>
                    {saving && <div className="space-y-1" role="status"><p className="text-sm text-slate-600">Uploading… {progress}%</p><progress className="w-full" max="100" value={progress} /></div>}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <button type="button" onClick={onClose} className="min-h-11 rounded border px-4">Cancel</button>
                        <button type="submit" disabled={saving} className="min-h-11 rounded bg-blue-700 px-4 font-semibold text-white disabled:opacity-60">{saving ? "Uploading…" : image ? "Save changes" : "Upload media"}</button>
                    </div>
                </form>
            </section>
        </div>
    );
}
