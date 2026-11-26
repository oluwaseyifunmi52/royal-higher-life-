import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicSiteContent } from "../services/publicContentService";
import {
    FaYoutube,
    FaWhatsapp,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt
} from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

import MinistriesLogo from "../assets/royal-logo-112.jpg";
export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [siteContent, setSiteContent] = useState({});
    useEffect(() => { getPublicSiteContent().then((response) => setSiteContent(response.data?.data || {})).catch(() => {}); }, []);

    const quickLinks = [
        { label: "Home", to: "/" },
        { label: "About Us", to: "/about" },
        { label: "Leadership", to: "/leadership" },
        { label: "Sermons", to: "/sermons" },
        { label: "Events", to: "/events" },
        { label: "Gallery", to: "/gallery" },
        { label: "Mission", to: "/mission" },
        { label: "Contact", to: "/contact" },
    ];

    const ministryLinks = [
        { label: "Worship", to: "/gallery#worship" },
        { label: "Prayer Ministry", to: "/contact#prayerForm" },
        { label: "Evangelism", to: "/mission#evangelism" },
        { label: "Outreach Programs", to: "/mission#community" },
        { label: "Youth Ministry", to: "/about#mission" },
        { label: "Church Planting", to: "/mission#church" },
    ];

    const contactInfo = {
        email: siteContent.email || "royalhigherlifeoutreach@gmail.com",
        phone: siteContent.phone || "+234 9157754411",
        whatsapp: (siteContent.phone || "+234 9157754411").replace(/\D/g, ""),
        address: siteContent.address || "Ibadan, Oyo State, Nigeria",
    };

    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img
                            src={MinistriesLogo}
                            alt="Royal Higher Life Ministries Logo"
                            className="footer-logo-image"
                            width="56"
                            height="56"
                        />
                        <span>Royal Higher Life</span>
                    </div>
                    <p className="footer-tagline">
                        {siteContent.footerDescription || "Empowering lives through faith, outreach, and impact. Committed to spreading the Gospel of Jesus Christ and raising a generation to live a higher life of holiness in Christ."}
                    </p>
                    <div className="footer-social">
                        <a 
                            href={siteContent.youtubeUrl || "https://youtube.com"}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="Subscribe on YouTube"
                            className="social-link youtube"
                        >
                            <FaYoutube aria-hidden="true" />
                        </a>
                        <a 
                            href={`https://wa.me/${contactInfo.whatsapp}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="Contact us on WhatsApp"
                            className="social-link whatsapp"
                        >
                            <FaWhatsapp aria-hidden="true" />
                        </a>
                        {siteContent.facebookUrl && <a href={siteContent.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit us on Facebook" className="social-link"><FaFacebookF aria-hidden="true" /></a>}
                        {siteContent.instagramUrl && <a href={siteContent.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit us on Instagram" className="social-link"><FaInstagram aria-hidden="true" /></a>}
                        {siteContent.xUrl && <a href={siteContent.xUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit us on X" className="social-link"><FaXTwitter aria-hidden="true" /></a>}
                    </div>
                </div>

                {/* Quick Links */}
                <nav className="footer-nav" aria-label="Quick Links">
                    <h3>Quick Links</h3>
                    <ul>
                        {quickLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Ministries */}
                <nav className="footer-nav" aria-label="Ministries">
                    <h3>Our Ministries</h3>
                    <ul>
                        {ministryLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contact Information */}
                <div className="footer-contact" aria-label="Contact Information">
                    <h3>Contact Us</h3>
                    <address>
                        <div className="contact-item">
                            <FaMapMarkerAlt aria-hidden="true" />
                            <span>{contactInfo.address}</span>
                        </div>
                        <div className="contact-item">
                            <FaPhone aria-hidden="true" />
                            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>{contactInfo.phone}</a>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope aria-hidden="true" />
                            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                        </div>
                        <div className="contact-item">
                            <FaWhatsapp aria-hidden="true" />
                            <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                                Chat on WhatsApp
                            </a>
                        </div>
                    </address>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="copyright">
                        &copy; {currentYear} Royal Higher Life Christian Ministries. All rights reserved.
                    </p>
                    <div className="footer-legal">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
