import { useEffect, useState } from "react";
import { getPublicGallery } from "../services/publicContentService";

const asset = (path) => new URL(`../assets/${path}`, import.meta.url).href;

const liveVideo = asset("video.mp4");

const videos = [
    liveVideo,
    asset("video1.mp4"),
    asset("video2.mp4"),
    asset("video3.mp4"),
];

const galleryImages = [
    { src: asset("royal12.jpeg"), alt: "Outreach" },
    { src: asset("royal11.jpeg"), alt: "Evangelism" },
    { src: asset("royal10.jpeg"), alt: "Church Program" },
    { src: asset("royal8.jpeg"), alt: "Community Support" },
    { src: asset("royal7.jpeg"), alt: "Outreach" },
    { src: asset("royal5.jpeg"), alt: "Evangelism" },
    { src: asset("royal4.jpeg"), alt: "Community Support" },
    { src: asset("royal3.jpeg"), alt: "Evangelism" },
    { src: asset("royal2.jpeg"), alt: "Church Program" },
    { src: asset("rolay1.jpeg"), alt: "Outreach" },
    { src: asset("oba.jpeg"), alt: "Community Support" },
    { src: asset("new1.jpeg"), alt: "New ministry" },
    { src: asset("new2.jpeg"), alt: "New outreach" },
    { src: asset("new3.jpeg"), alt: "New event" },
    { src: asset("new4.jpeg"), alt: "New testimony" },
    { src: asset("new5.jpeg"), alt: "Praise moment" },
    { src: asset("new6.jpeg"), alt: "Prayer time" },
];

const slides = ["Welcome - Live Starting Soon", "Worship Session", "Announcement Time"];

function getEmbedUrl(value) {
    try {
        const url = new URL(value);
        if (["youtu.be", "www.youtube.com", "youtube.com"].includes(url.hostname)) {
            const videoId = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.split("/").filter(Boolean).at(-1);
            return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : "";
        }
        if (["vimeo.com", "www.vimeo.com"].includes(url.hostname)) {
            const videoId = url.pathname.split("/").filter(Boolean).at(-1);
            return /^\d+$/.test(videoId || "") ? `https://player.vimeo.com/video/${videoId}` : "";
        }
    } catch { return ""; }
    return "";
}

function formatCountdown(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function Media() {
    const [countdown, setCountdown] = useState(2 * 60 * 60);
    const [activeSlide, setActiveSlide] = useState(0);
    const [publishedVideos, setPublishedVideos] = useState([]);
    const [publishedAudio, setPublishedAudio] = useState([]);
    const [liveStreamUrl, setLiveStreamUrl] = useState("");

    useEffect(() => {
        getPublicGallery().then((response) => {
            const items = Array.isArray(response?.data?.data) ? response.data.data : [];
            setPublishedVideos(items.filter((item) => item.mediaType === "video" && item.videoUrl));
            setPublishedAudio(items.filter((item) => item.mediaType === "audio" && item.videoUrl));
            const liveItem = items.find((item) => item.mediaType === "live" || item.isLive);
            if (liveItem?.videoUrl) setLiveStreamUrl(liveItem.videoUrl);
        }).catch(() => setPublishedVideos([]));
    }, []);

    useEffect(() => {
        const timerId = window.setInterval(() => {
            setCountdown((timeLeft) => Math.max(timeLeft - 1, 0));
        }, 1000);

        return () => window.clearInterval(timerId);
    }, []);

    useEffect(() => {
        const slideId = window.setInterval(() => {
            setActiveSlide((current) => (current + 1) % slides.length);
        }, 3000);

        return () => window.clearInterval(slideId);
    }, []);

    return (
        <>
            <section className="media-section" id="videos" aria-label="Ministry videos">
                <div className="container">
                    <div className="page-header">
                        <h2 className="section-title">Our Videos</h2>
                        <p className="section-subtitle">
                            Watch moments of worship, teachings, and outreach from Royal Higher Life Christian Ministries.
                        </p>
                    </div>

                    <div className="video-grid">
                        {publishedVideos.length ? publishedVideos.map((item) => (
                            <article className="video-card" key={item._id}>
                                {item.mimeType === "video/link" ? <iframe title={item.title} src={getEmbedUrl(item.videoUrl)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video controls poster={item.thumbnailUrl || undefined}><source src={item.videoUrl} type={item.mimeType || "video/mp4"} />Your browser does not support the video tag.</video>}
                                <h3>{item.title}</h3>
                                {item.description && <p>{item.description}</p>}
                            </article>
                        )) : videos.map((video) => (
                            <article className="video-card" key={video}>
                                <video controls><source src={video} type="video/mp4" />Your browser does not support the video tag.</video>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {publishedAudio.length > 0 && (
                <section className="media-section" aria-label="Sermon audio">
                    <div className="container">
                        <div className="page-header">
                            <h2 className="section-title">Sermon Audio</h2>
                        </div>
                        <div className="video-grid">
                            {publishedAudio.map((item) => (
                                <article className="video-card" key={item._id}>
                                    <h3>{item.title}</h3>
                                    {item.description && <p>{item.description}</p>}
                                    <audio controls preload="none"><source src={item.videoUrl} type={item.mimeType} />Your browser does not support the audio element.</audio>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="media-section" id="live" aria-label="Live service">
                <div className="container live-container">
                    <div className="live-grid">
                        <div className="countdown-box">
                            <h3>Service starts in:</h3>
                            <p id="countdown">{formatCountdown(countdown)}</p>
                        </div>

                        <div className="slides">
                            {slides.map((slide, index) => (
                                <div className={`slide ${index === activeSlide ? "active" : ""}`} key={slide}>
                                    <h2>{slide}</h2>
                                </div>
                            ))}
                        </div>

                        <div className="video-area">
                            <video controls autoPlay muted loop className="live-video">
                                <source src={liveVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        <div className="chat-area">
                            <h2>Live Service</h2>
                            <p>Join us live and be blessed.</p>

                            {getEmbedUrl(liveStreamUrl) ? (
                                <iframe
                                    src={getEmbedUrl(liveStreamUrl)}
                                    title="Royal Higher Life live service"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="live-unavailable">
                                    <p>Live stream is not available at this time.</p>
                                    <p>Check back during service hours or visit our media archive.</p>
                                </div>
                            )}

                            <div className="live-buttons">
                                <a href="https://youtube.com" className="btn btn-primary" rel="noreferrer" target="_blank">
                                    Watch on YouTube
                                </a>
                                <a href="/mission" className="btn btn-outline">
                                    Join Mission
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="media-section" id="gallery" aria-label="Photo gallery">
                <div className="container">
                    <div className="page-header">
                        <h2 className="section-title">Our Gallery</h2>
                    </div>

                    <div className="gallery-grid">
                        {galleryImages.map((image) => (
                            <img
                                src={image.src}
                                alt={image.alt}
                                key={image.src}
                                loading="lazy"
                                className="w-full h-auto max-h-[400px] object-cover"
                            />
                        ))}
                    </div>

                    {publishedVideos.length > 0 && (
                        <div className="gallery-video-section" style={{ marginTop: "2rem" }}>
                            <h3 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Video Gallery</h3>
                            <div className="video-grid">
                                {publishedVideos.map((item) => (
                                    <article className="video-card" key={item._id}>
                                        {item.mimeType === "video/link" ? (
                                            <iframe
                                                title={item.title}
                                                src={getEmbedUrl(item.videoUrl)}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                controls
                                                poster={item.thumbnailUrl || undefined}
                                            >
                                                <source src={item.videoUrl} type={item.mimeType || "video/mp4"} />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <h3>{item.title}</h3>
                                        {item.description && <p>{item.description}</p>}
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
