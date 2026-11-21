import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { asset } from "./imageUtils";

export default function Hero({ title, children, image, ctaText, ctaLink }) {
    const poster = image || asset("welcome pics.webp");
    const backgroundVideo = asset("background.mp4");
    const [videoReady, setVideoReady] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);
    const videoRef = useRef(null);
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Defer video download until after initial paint. Poster covers the hero
    // immediately so LCP is driven by the small optimized poster image.
    useEffect(() => {
        if (prefersReducedMotion) return;
        const timer = setTimeout(() => setVideoReady(true), 1200);
        return () => clearTimeout(timer);
    }, [prefersReducedMotion]);

    // Once the deferred video element is mounted, start playback.
    useEffect(() => {
        if (!videoReady || !videoRef.current) return;
        setPlayVideo(true);
    }, [videoReady]);

    useEffect(() => {
        if (!playVideo || !videoRef.current) return;
        videoRef.current.play().catch(() => {
            // Autoplay may be blocked by the browser; poster remains visible.
        });
    }, [playVideo]);

    return (
        <section className="hero">
            {/* Poster image: displayed immediately (LCP). Optimized WebP. */}
            <div className="hero-image-container" aria-hidden="true">
                <img
                    src={poster}
                    alt="Royal HigherLife Ministries"
                    className="hero-image"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    aria-hidden="true"
                />
            </div>

            {/* Deferred background video: preload=none, playback starts after idle. */}
            {videoReady && !prefersReducedMotion && (
                <video
                    ref={videoRef}
                    className="hero-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    onError={() => {
                        // Fall back to poster only.
                    }}
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
            )}

            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-content">
                <span className="hero-eyebrow">Royal HigherLife Ministries</span>
                <h1>{title}</h1>
                <p>{children}</p>
                {ctaText && ctaLink && <Link className="btn btn-primary" to={ctaLink}>{ctaText}</Link>}
            </div>
        </section>
    );
}
