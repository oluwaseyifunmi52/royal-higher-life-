import { useEffect, useState } from "react";
import SocialLinks from "../Components/SocialLinks.jsx";

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
    { src: asset("royal1.jpeg"), alt: "Outreach" },
    { src: asset("oba.jpeg"), alt: "Community Support" },
    { src: asset("new1.jpeg"), alt: "New ministry" },
    { src: asset("new2.jpeg"), alt: "New outreach" },
    { src: asset("new3.jpeg"), alt: "New event" },
    { src: asset("new4.jpeg"), alt: "New testimony" },
    { src: asset("new5.jpeg"), alt: "Praise moment" },
    { src: asset("new6.jpeg"), alt: "Prayer time" },
];

const slides = ["Welcome - Live Starting Soon", "Worship Session", "Announcement Time"];

function formatCountdown(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function Media() {
    const [countdown, setCountdown] = useState(2 * 60 * 60);
    const [activeSlide, setActiveSlide] = useState(0);

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
                    {videos.map((video) => (
                        <div className="video-card" key={video}>
                            <video controls>
                                <source src={video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            </section>

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
                        <video controls autoPlay muted loop className="live-video">
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
                        <img src={image.src} alt={image.alt} key={image.src} />
                    ))}
                </div>
            </section>

            <SocialLinks />
        </>
    );
}