const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2.04c6.61 0 11.96 5.36 11.96 11.96 0 3.26-1.31 6.22-3.49 8.39-.67 1.26-1.58 2.43-2.73 3.39v-6.98h-3.27v3.91h-2.92v-3.91h-1.82v-3h1.82v-1.95c0-2.01 1.06-3.07 3.21-3.07 1.19 0 2.12.08 2.34.11v2.75h-3.46c-1.18 0-2.03.8-2.03 2.08v1.49h3.69l-.59 3h-3.1v6.98c-3.42-2.16-5.94-5.62-5.94-10.38 0-6.61 5.35-11.96 11.96-11.96" fill="currentColor" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2.16c3.2 0 5.83 2.62 5.83 5.84s-2.63 5.84-5.84 5.84-5.83-2.62-5.83-5.84 2.63-5.84 5.83-5.84m0 4.46c-1.8 0-3.26 1.46-3.26 3.26s1.46 3.26 3.26 3.26 3.26-1.46 3.26-3.26-1.46-3.26-3.26-3.26zm0 6.41c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05m5.49-1.45c-.21 0-.41-.08-.56-.22-.2-.2-.2-.52 0-.72l2.23-2.23c.19-.2.24-.48.1-.74-.14-.25-.42-.32-.68-.19l-2.23 2.23c-.27.26-.72.27-1.04 0l-2.23-2.23c-.26-.27-.27-.71-.01-1.04l2.23-2.23c.2-.2.52-.2.72 0 .19.2.24.49.1.75l-2.23 2.23c-.19.2-.48.24-.74.11-.25-.13-.33-.42-.19-.68l2.23-2.23c.2-.21.48-.24.72-.02.26.25.27.71.02 1.04l-2.23 2.23c-.19.19-.44.29-.72.29-.27-.01-.53-.1-.74-.29l-2.23 2.23c-.3.31-.31.81-.02 1.11.13.14.32.22.52.22.39 0 .78-.15 1.07-.43l2.23-2.23c.21-.2.51-.2.72 0l2.23 2.23c.18.19.29.44.29.71s-.11.53-.31.72" fill="currentColor" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20.35 2.65c-5.48-1.47-11.55 2.23-13.3 7.54-1.75 5.32.64 10.74 5.08 12.72 4.44 1.99 8.77-.33 11.31-4.03 2.15-3.14 1.84-7.7-3.09-16.23zm-.12 18.33c-1.58 3.39-5.31 5.24-9.74 3.87-4.41-1.36-5.92-6.97-3.96-11.09 2.34-4.92 6.53-7.83 11.32-7.12 4.27.64 7.89 4.33 8.49 8.31.57 3.82-2.16 7.31-6.11 6.03z" fill="currentColor" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.25 4.26h3.317l6.246 9.47L18.24 4.26z" fill="currentColor" />
    </svg>
);

const YoutubeIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M23.498 6.225c-.363-2.357-2.398-4.126-4.766-4.126H4.765C2.397 2.1 0 3.869 0 6.226v11.55c0 2.357 2.397 4.126 4.765 4.126h13.967c2.367 0 4.402-1.769 4.765-4.126V6.226c0-.372-.043-.733-.234-1.001m-20 2.725v3.78c0 .389.071.765.219 1.113.105.248.25.48.444.688l4.212 4.41c.176.183.384.29.61.29s.434-.107.61-.29l4.212-4.41c.194-.208.339-.44.444-.688.148-.348.219-.724.219-1.113V8.95c0-.389-.071-.765-.219-1.113-.105-.248-.25-.48-.444-.688L10.45 3.356c-.176-.183-.384-.29-.61-.29s-.434.107-.61.29L4.498 8.262c-.194.208-.339.44-.444.688C3.925 8.528 3.854 8.904 3.854 9.293z" fill="currentColor" />
    </svg>
);

const socials = [
    { label: "Facebook", note: "Join our community", href: "https://facebook.com", Icon: FacebookIcon, className: "facebook" },
    { label: "Instagram", note: "See our moments", href: "https://instagram.com", Icon: InstagramIcon, className: "instagram" },
    { label: "YouTube", note: "Watch our messages", href: "https://youtube.com", Icon: YoutubeIcon, className: "youtube" },
    { label: "WhatsApp", note: "Chat with us", href: "https://wa.me/2349057754411", Icon: WhatsAppIcon, className: "whatsapp" },
    { label: "Twitter (X)", note: "Latest updates", href: "https://x.com", Icon: XIcon, className: "twitter" },
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
                            <social.Icon size={32} aria-label={social.label} />
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