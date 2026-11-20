import { useEffect, useState } from "react";
import { getAdminSiteContent, saveAdminSiteContent } from "../../services/adminService";

const fields = [
  ["heroHeading", "Homepage hero heading"], ["heroDescription", "Homepage hero description"], ["heroImageUrl", "Hero image URL (HTTPS)"],
    ["heroCtaText", "Hero action text"], ["heroCtaLink", "Hero action link"], ["welcomeHeading", "Welcome heading"], ["welcomeText", "Welcome message"],
  ["aboutText", "About the ministry"], ["mission", "Mission"], ["vision", "Vision"], ["coreBeliefs", "Core beliefs"], ["ministryPurpose", "Ministry purpose"],
  ["phone", "Contact phone"], ["email", "Contact email"], ["address", "Physical address"], ["officeHours", "Office information / hours"],
  ["footerDescription", "Footer description"], ["facebookUrl", "Facebook URL"], ["instagramUrl", "Instagram URL"], ["youtubeUrl", "YouTube URL"], ["xUrl", "X URL"],
];

export default function SiteContentEditor() {
  const [content, setContent] = useState({});
  const [published, setPublished] = useState(false);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    getAdminSiteContent().then((response) => {
      const result = response.data?.data || {};
      setContent(result.content || {});
      setPublished(Boolean(result.isPublished));
    }).catch((err) => setError(err.response?.data?.message || "Website content could not be loaded.")).finally(() => setBusy(false));
  }, []);
  const save = async (publish) => {
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await saveAdminSiteContent(content, publish);
      setPublished(Boolean(response.data?.data?.isPublished));
      setMessage(publish ? "Website content published." : "Draft saved. The public website is unchanged.");
    } catch (err) { setError(err.response?.data?.message || "Website content could not be saved."); }
    finally { setSaving(false); }
  };
  if (busy) return <p role="status">Loading website content…</p>;
  return <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold text-slate-900">Website content</h2><p className="text-sm text-slate-600">Edit homepage, ministry, contact and footer text. Existing content stays as the fallback until you publish.</p></div><span className={`rounded-full px-3 py-1 text-sm ${published ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-700"}`}>{published ? "Published" : "Using existing website content"}</span></div>
    {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">{message}</p>}
    <div className="grid gap-4 md:grid-cols-2">{fields.map(([key, label]) => <label key={key} className="block text-sm font-medium text-slate-700">{label}{["heroDescription", "welcomeText", "aboutText", "mission", "vision", "coreBeliefs", "ministryPurpose", "footerDescription"].includes(key) ? <textarea rows={key === "aboutText" ? 5 : 3} value={content[key] || ""} onChange={(event) => setContent((old) => ({ ...old, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /> : <input type={key.endsWith("Url") ? "url" : "text"} value={content[key] || ""} onChange={(event) => setContent((old) => ({ ...old, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />}</label>)}</div>
    <div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-5"><button type="button" disabled={saving} onClick={() => save(false)} className="min-h-11 rounded-lg border border-slate-300 px-5 font-semibold disabled:opacity-50">{saving ? "Saving…" : "Save draft"}</button><button type="button" disabled={saving} onClick={() => save(true)} className="min-h-11 rounded-lg bg-amber-500 px-5 font-semibold text-slate-950 disabled:opacity-50">{saving ? "Saving…" : "Publish changes"}</button></div>
  </section>;
}
