import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function NewsletterUnsubscribe() {
    const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token") || "");
    const [status, setStatus] = useState("ready");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (token) window.history.replaceState({}, "", window.location.pathname);
    }, [token]);

    const unsubscribe = async () => {
        if (!token || status === "submitting") return;
        setStatus("submitting");
        setMessage("");
        try {
            const response = await api.put("/api/newsletter/unsubscribe", { token });
            setStatus("done");
            setMessage(response.data?.message || "Your email preferences have been updated.");
        } catch {
            setStatus("error");
            setMessage("We could not process this link. It may have expired or already been used.");
        }
    };

    return (
        <main className="mx-auto max-w-2xl px-5 py-16" aria-labelledby="newsletter-unsubscribe-title">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">Email preferences</p>
                <h1 id="newsletter-unsubscribe-title" className="text-3xl font-bold text-slate-900">Unsubscribe from ministry updates</h1>
                <p className="mt-4 text-slate-700">Confirm below to stop newsletter messages. This private link expires after seven days and can be used once.</p>
                {message && <p className="mt-5 rounded-lg bg-slate-50 p-4 text-slate-800" role="status">{message}</p>}
                {status === "ready" && token && <button className="mt-6 min-h-11 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700" onClick={unsubscribe}>Confirm unsubscribe</button>}
                {status === "submitting" && <p className="mt-6" role="status">Updating your preferences…</p>}
                {!token && <p className="mt-6 text-red-700" role="alert">The unsubscribe link is incomplete. Open the full link from your email.</p>}
                <div className="mt-8"><Link to="/" className="font-semibold text-amber-800 underline">Return to the home page</Link></div>
            </section>
        </main>
    );
}
