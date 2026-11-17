import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../Components/SEO";
import SermonMedia from "../Components/SermonMedia";
import { getPublicSermon } from "../services/publicContentService";

export default function SermonDetail() {
    const { id } = useParams();
    const [sermon, setSermon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;
        setLoading(true);
        getPublicSermon(id)
            .then(({ data }) => { if (active) setSermon(data.data); })
            .catch(() => { if (active) setError(true); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [id]);

    if (loading) return <section className="container mx-auto px-4 py-16" role="status">Loading sermon…</section>;
    if (error || !sermon) return <section className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold">Sermon unavailable</h1><p className="mt-3">This sermon could not be loaded.</p><Link className="mt-6 inline-block text-blue-800 underline" to="/sermons">Back to sermons</Link></section>;

    return (
        <article className="container mx-auto max-w-5xl px-4 py-10 sm:py-16">
            <SEO title={sermon.title} description={sermon.description || `Watch ${sermon.title} from Royal HigherLife Christian Ministries.`} />
            <Link className="mb-6 inline-block text-sm font-semibold text-blue-900 underline" to="/sermons">← All sermons</Link>
            <h1 className="mb-3 font-display text-3xl font-bold text-slate-950 sm:text-4xl">{sermon.title}</h1>
            <div className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {(sermon.preacher || sermon.speaker) && <span>{sermon.preacher || sermon.speaker}</span>}
                {(sermon.sermonDate || sermon.date) && <time dateTime={sermon.sermonDate || sermon.date}>{new Date(sermon.sermonDate || sermon.date).toLocaleDateString()}</time>}
                {sermon.scripture && <span>{sermon.scripture}</span>}
            </div>
            <SermonMedia sermon={sermon} />
            {sermon.description && <p className="mt-6 whitespace-pre-line leading-7 text-slate-700">{sermon.description}</p>}
        </article>
    );
}
