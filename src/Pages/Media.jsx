import { useEffect, useState } from "react";
import { getPublicGallery } from "../services/publicContentService";
import SocialLinks from "../Components/SocialLinks.jsx";
import { asset } from "../Components/imageUtils";
import OptimizedImage from "../Components/OptimizedImage";

const liveVideo = asset("video.mp4");

const videos = [
    { src: asset("video.mp4"), poster: asset("welcome pics.webp"), label: "Live Service" },
    { src: asset("video1.mp4"), poster: asset("royal3.webp"), label: "Worship Session" },
    { src: asset("video2.mp4"), poster: asset("royal3.webp"), label: "Outreach" },
    { src: asset("video3.mp4"), poster: asset("royal3.webp"), label: "Teaching" },
];

const galleryImages = [
    { src: asset("royal12.jpeg"), webp: asset("thumb-royal12.webp"), alt: "Outreach" },
    { src: asset("royal11.jpeg"), webp: asset("thumb-royal11.webp"), alt: "Evangelism" },
    { src: asset("royal10.jpeg"), webp: asset("thumb-royal10.webp"), alt: "Church Program" },
    { src: asset("royal8.jpeg"), webp: asset("thumb-royal8.webp"), alt: "Community Support" },
    { src: asset("royal7.jpeg"), webp: asset("thumb-royal7.webp"), alt: "Outreach" },
    { src: asset("royal5.jpeg"), webp: asset("thumb-royal5.webp"), alt: "Evangelism" },
    { src: asset("royal4.jpeg"), webp: asset("thumb-royal4.webp"), alt: "Community Support" },
    { src: asset("royal3.jpeg"), webp: asset("thumb-royal3.webp"), alt: "Evangelism" },
    { src: asset("royal2.jpeg"), webp: asset("thumb-royal2.webp"), alt: "Church Program" },
    { src: asset("rolay1.jpeg"), webp: asset("thumb-rolay1.webp"), alt: "Outreach" },
    { src: asset("oba.jpeg"), webp: asset("thumb-oba.webp"), alt: "Community Support" },
    { src: asset("new1.jpeg"), webp: asset("thumb-new1.webp"), alt: "New ministry" },
    { src: asset("new2.jpeg"), webp: asset("thumb-new2.webp"), alt: "New outreach" },
    { src: asset("new3.jpeg"), webp: asset("thumb-new3.webp"), alt: "New event" },
    { src: asset("new4.jpeg"), webp: asset("thumb-new4.webp"), alt: "New testimony" },
    { src: asset("new5.jpeg"), webp: asset("thumb-new5.webp"), alt: "Praise moment" },
    { src: asset("new6.jpeg"), webp: asset("thumb-new6.webp"), alt: "Prayer time" },
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

    useEffect(() => {
        getPublicGallery().then((response) => {
            const items = Array.isArray(response?.data?.data) ? response.data.data : [];
            setPublishedVideos(items.filter((item) => item.mediaType === "video" && item.videoUrl));
            setPublishedAudio(items.filter((item) => item.mediaType === "audio" && item.videoUrl));
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
            <section id="videos" className="video-section">
                <h2 className="section-title">Our Videos</h2>
                <p className="section-subtitle">
                    Watch moments of worship, teachings, and outreach from Royal Higher Life Christian Ministries.
                </p>

                <div className="video-grid">
                    {publishedVideos.length ? publishedVideos.map((item) => (
                        <div className="video-card" key={item._id}>
                            {item.mimeType === "video/link" ? (
                                <iframe title={item.title} src={getEmbedUrl(item.videoUrl)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            ) : (
                                <video controls preload="none" poster={item.thumbnailUrl || undefined} width="640" height="360" aria-label={item.title}>
                                    <source src={item.videoUrl} type={item.mimeType || "video/mp4"} />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <h3>{item.title}</h3>
                            {item.description && <p>{item.description}</p>}
                        </div>
                    )) : videos.map((video) => (
                        <div className="video-card" key={video.src}>
                            <video
                                controls
                                preload="none"
                                poster={video.poster}
                                width="640"
                                height="360"
                                aria-label={video.label}
                            >
                                <source src={video.src} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            </section>

            {publishedAudio.length > 0 && <section className="video-section"><h2 className="section-title">Sermon Audio</h2><div className="video-grid">{publishedAudio.map((item) => <article className="video-card" key={item._id}><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}<audio controls preload="none"><source src={item.videoUrl} type={item.mimeType} />Your browser does not support the audio element.</audio></article>)}</div></section>}

            <section id="live" className="live-section">
                <div className="live-container">
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
                        <video
                            controls
                            preload="none"
                            poster={asset("welcome pics.webp")}
                            className="live-video"
                            width="640"
                            height="360"
                            aria-label="Live service"
                        >
                            <source src={liveVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="chat-area">
                        <h2>Live Service</h2>
                        <p>Join us live and be blessed.</p>

                        <iframe
                            src="https://www.youtube.com/embed/live_stream?channel=UCabc123REALID"
                            title="Royal Higher Life live service"
                            loading="lazy"
                        />

                        <div className="live-buttons">
                            <a href="https://youtube.com" className="btn" rel="noreferrer" target="_blank">
                                Watch on YouTube
                            </a>
                            <a href="/mission" className="btn outline">
                                Join Mission
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="gallery">
                <h2 className="section-title">Our Gallery</h2>

                <div className="gallery-container">
                    {galleryImages.map((image) => (
                        <OptimizedImage
                            key={image.src}
                            src={image.src}
                            webp={image.webp}
                            alt={image.alt}
                            width="400"
                            height="300"
                            loading="lazy"
                            decoding="async"
                            className="media-gallery-img"
                        />
                    ))}
                </div>
            </section>
        </>
    );
}
