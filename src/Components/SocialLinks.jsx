import facebook from "../assets/facebook.png";
import instagram from "../assets/Instagram.png";
import whatsapp from "../assets/whatapp.jpg";
import xIcon from "../assets/x.avif";
import youtube from "../assets/youtube.png";

const socials = [
    { label: "Facebook", note: "Join our community", href: "https://facebook.com", icon: facebook, className: "facebook" },
    { label: "Instagram", note: "See our moments", href: "https://instagram.com", icon: instagram, className: "instagram" },
    { label: "YouTube", note: "Watch our messages", href: "https://youtube.com", icon: youtube, className: "youtube" },
    { label: "WhatsApp", note: "Chat with us", href: "https://wa.me/2349057754411", icon: whatsapp, className: "whatsapp" },
    { label: "Twitter (X)", note: "Latest updates", href: "https://x.com", icon: xIcon, className: "twitter" },
];

export default function SocialLinks() {
    return (
        <section className="contact-section socials-section">
            <div className="contact-wrapper">
                <h2>Connect With Us</h2>
                <p className="subtitle">Stay connected with our community</p>
                <div className="social-container">
                    {socials.map((social) => (
                        <a
                            className={`social-card ${social.className}`}
                            href={social.href}
                            key={social.label}
                            rel="noreferrer"
                            target="_blank"
                        >
                            <img src={social.icon} alt="" />
                            <div>
                                <strong>{social.label}</strong>
                                <small>{social.note}</small>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}