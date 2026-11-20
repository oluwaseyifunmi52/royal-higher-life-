import { useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/welcome pics.jpeg";

export default function Hero({ title, children, image, ctaText, ctaLink }) {
    const [useVideo, setUseVideo] = useState(!image);
    const [videoError, setVideoError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const backgroundVideo = new URL("../assets/background.mp4", import.meta.url).href;
    const backgroundImage = image || heroImage;

    const handleVideoError = () => {
        setVideoError(true);
        setUseVideo(false);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <section className="hero">
            {useVideo && !videoError && (
                <video 
                    className="hero-video" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    aria-hidden="true"
                    onError={handleVideoError}
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
            )}
            
            {(videoError || !useVideo) && (
                <div 
                    className="hero-image-container" 
                    aria-hidden="true"
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                >
                    <img 
                        src={backgroundImage} 
                        alt="Royal HigherLife Ministries" 
                        className="hero-image"
                        onLoad={handleImageLoad}
                    />
                </div>
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
