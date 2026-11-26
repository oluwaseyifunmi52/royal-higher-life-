import { Link } from "react-router-dom";
import communityPhoto from "../assets/royal4.jpeg";
import backgroundVideo from "../assets/background.mp4";

export default function Hero({ title, children, image, ctaText }) {
    return (
        <section className="hero hero-editorial" aria-labelledby="home-hero-title">
            <video
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={image || communityPhoto}
                aria-hidden="true"
            >
                <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-editorial-copy">
                <span className="hero-eyebrow">Royal HigherLife Christian Ministries</span>
                <h1 id="home-hero-title">{title || "A Place to Belong, Believe & Become"}</h1>
                <p>{children}</p>
                <div className="hero-actions">
                    <Link className="btn btn-primary" to="/about">{ctaText || "Get to Know Us"}</Link>
                    <a className="btn btn-outline" href="#prayer">Send a Prayer Request</a>
                </div>
            </div>
        </section>
    );
}
