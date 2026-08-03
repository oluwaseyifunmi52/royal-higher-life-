import backgroundVideo from "../assets/background.mp4";

export default function Hero({ title, children }) {
    return (
        <section className="hero">
            <video className="hero-video" autoPlay muted loop playsInline aria-hidden="true">
                <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-content">
                <span className="hero-eyebrow">Royal HigherLife Ministries</span>
                <h1>{title}</h1>
                <p>{children}</p>
            </div>
        </section>
    );
}
