import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function CancelEventRegistration() {
    const { id } = useParams();
    const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token") || "");
    const [status, setStatus] = useState("ready");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (token) window.history.replaceState({}, "", window.location.pathname);
    }, [token]);

    const cancelRegistration = async () => {
        if (!token || status === "submitting") return;
        setStatus("submitting");
        setMessage("");
        try {
            const response = await api.put(`/api/event-registrations/${encodeURIComponent(id)}/cancel`, { token });
            setStatus("done");
            setMessage(response.data?.message || "Your registration has been cancelled.");
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.message || "This cancellation link is invalid or expired.");
        }
    };

    return (
        <main className="mx-auto max-w-2xl px-5 py-16" aria-labelledby="cancel-registration-title">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700">Event registration</p>
                <h1 id="cancel-registration-title" className="text-3xl font-bold text-slate-900">Cancel your registration</h1>
                <p className="mt-4 text-slate-700">Use the private link sent to your registration email to confirm this action. It can be used once and expires after 30 days.</p>
                {message && <p className="mt-5 rounded-lg bg-slate-50 p-4 text-slate-800" role="status">{message}</p>}
                {status === "ready" && token && <button className="mt-6 min-h-11 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700" onClick={cancelRegistration}>Confirm cancellation</button>}
                {status === "submitting" && <p className="mt-6" role="status">Cancelling…</p>}
                {!token && <p className="mt-6 text-red-700" role="alert">The cancellation link is incomplete. Open the full link from your registration email.</p>}
                <div className="mt-8"><Link to="/events" className="font-semibold text-amber-800 underline">Return to events</Link></div>
            </section>
        </main>
    );
}
