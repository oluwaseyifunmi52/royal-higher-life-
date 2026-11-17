import { useEffect, useState } from "react";

function getYouTubeVideoId(url = "") {
    try {
        const parsed = new URL(url);
        if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0];
        if (parsed.hostname.endsWith("youtube.com")) {
            if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
            const match = parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
            return match?.[1] || null;
        }
    } catch {
        return null;
    }
    return null;
}

export default function SermonMedia({ sermon }) {
    const videoUrl = sermon?.videoUrl;
    const audioUrl = sermon?.audioUrl;
    const youtubeId = getYouTubeVideoId(videoUrl);
    const [videoUnavailable, setVideoUnavailable] = useState(false);

    useEffect(() => {
        setVideoUnavailable(false);
    }, [videoUrl]);

    if (youtubeId) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}`}
                    title={sermon.title ? `Sermon: ${sermon.title}` : "Sermon video"}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
        );
    }

    if (videoUrl) {
        if (videoUnavailable) {
            return <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700" role="alert">This sermon video could not be loaded. Please try again later.</p>;
        }

        return <video className="aspect-video w-full rounded-xl bg-black object-contain" controls playsInline preload="metadata" poster={sermon.image || sermon.imageUrl || undefined} onError={() => setVideoUnavailable(true)}><source src={videoUrl} />Your browser does not support video playback.</video>;
    }

    if (audioUrl) {
        return <audio className="w-full" controls preload="metadata"><source src={audioUrl} />Your browser does not support audio playback.</audio>;
    }

    return <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700">Playback is not available for this sermon yet.</p>;
}
