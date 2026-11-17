import { useEffect, useState } from "react";
import { updateTestimony } from "../../services/adminService";

export default function AdminTestimonyForm({ testimony, onClose, onSaved }) {
    const [form, setForm] = useState({ name: "", message: "", rating: 5, status: "pending", isApproved: false });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!testimony) return;
        setForm({
            name: testimony.name || "",
            message: testimony.message || "",
            rating: testimony.rating || 5,
            status: testimony.status || (testimony.isApproved ? "approved" : "pending"),
            isApproved: Boolean(testimony.isApproved),
        });
    }, [testimony]);

    const updateField = (event) => {
        const { name, value, checked, type } = event.target;
        setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            await updateTestimony(testimony._id, { ...form, rating: Number(form.rating), isApproved: form.status === "approved" });
            if (onSaved) await onSaved();
            else onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Could not update this testimony.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="testimony-form-title">
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="testimony-form-title" className="text-xl font-bold text-slate-900">Review testimony</h2>
                    <button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded text-2xl text-slate-600" aria-label="Close">&times;</button>
                </div>
                {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
                <dl className="mb-4 grid gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                    <div><dt className="inline font-semibold">Reference: </dt><dd className="inline">{testimony?.reference || "Legacy submission"}</dd></div>
                    <div><dt className="inline font-semibold">Contributor email: </dt><dd className="inline">{testimony?.email || "Not provided"}</dd></div>
                    <div><dt className="inline font-semibold">Publication consent: </dt><dd className="inline">{testimony?.publicationConsent ? "Given" : "Not given"}</dd></div>
                    <div><dt className="inline font-semibold">Submitted: </dt><dd className="inline">{testimony?.createdAt ? new Date(testimony.createdAt).toLocaleString() : "—"}</dd></div>
                    <div><dt className="inline font-semibold">Email notifications: </dt><dd className="inline">{testimony?.notificationStatus || "Unknown"}{testimony?.notificationFailure ? ` (${testimony.notificationFailure})` : ""}</dd></div>
                </dl>
                <form onSubmit={submit} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">Name<input className="mt-1 w-full rounded border p-3" name="name" value={form.name} onChange={updateField} required /></label>
                    <label className="block text-sm font-medium text-slate-700">Testimony<textarea className="mt-1 w-full rounded border p-3" name="message" value={form.message} onChange={updateField} rows={5} required /></label>
                    <label className="block text-sm font-medium text-slate-700">Rating<select className="mt-1 w-full rounded border p-3" name="rating" value={form.rating} onChange={updateField}>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating}</option>)}</select></label>
                    <label className="block text-sm font-medium text-slate-700">Review status
                        <select className="mt-1 w-full rounded border p-3" name="status" value={form.status} onChange={updateField}>
                            <option value="pending">Pending review</option>
                            <option value="approved" disabled={!testimony?.publicationConsent}>Approved for publication</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </label>
                    {!testimony?.publicationConsent && <p className="text-sm text-amber-700">This submission cannot be published until the contributor gives publication consent.</p>}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <button type="button" onClick={onClose} className="min-h-11 rounded border px-4">Cancel</button>
                        <button type="submit" disabled={saving || !testimony || (form.status === "approved" && !testimony.publicationConsent)} className="min-h-11 rounded bg-blue-700 px-4 font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save review"}</button>
                    </div>
                </form>
            </section>
        </div>
    );
}
