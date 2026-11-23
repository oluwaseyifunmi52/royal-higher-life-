import { Link } from "react-router-dom";
import SEO from "../Components/SEO.jsx";

const sections = [
    {
        title: "Information collected",
        paragraphs: [
            "The website may receive information you choose to provide through forms, such as your name, email address, phone number, message, prayer request, or details submitted in connection with an event or donation.",
            "The website may also process technical information associated with visiting a website, such as browser and device data or pages requested. The specific information collected by this site and its hosting services requires owner confirmation.",
        ],
    },
    {
        title: "Forms, prayer requests, and contact information",
        paragraphs: [
            "Information submitted through contact, prayer, or other forms may be used to understand and respond to your message. Please share only information you are comfortable providing, and avoid including sensitive details that are not needed.",
            "Who can access these submissions, how they are handled, and whether they are shared with ministry teams must be confirmed by the website owner before publication as a complete privacy notice.",
        ],
    },
    {
        title: "Donations and payment information",
        paragraphs: [
            "Donation transactions may involve a payment service. Do not submit full card or bank credentials in a general website message. The payment provider, data it receives, and whether any transaction details are stored by the ministry require owner confirmation. Review the payment provider's privacy notice when completing a transaction.",
        ],
    },
    {
        title: "Cookies and website usage",
        paragraphs: [
            "The website or its service providers may use cookies or similar technologies for essential operation, preferences, analytics, or security. The technologies actually used, their purposes, and available controls require owner confirmation.",
        ],
    },
    {
        title: "How information is used",
        paragraphs: [
            "Information you submit may be used to respond to requests, administer registrations or donations, and operate or protect the website. Any additional uses, such as newsletters or analytics, should be confirmed by the owner and described here before this policy is treated as final.",
        ],
    },
    {
        title: "Storage, security, and retention",
        paragraphs: [
            "Information is processed using the website and services selected by the ministry. The storage locations, safeguards, retention periods, and deletion procedures are not specified here and must be confirmed by the owner. No online transmission or storage method can be described here as completely secure.",
        ],
    },
    {
        title: "Third-party services",
        paragraphs: [
            "The site may rely on hosting, payment, communications, or other service providers. The providers currently used and the information each receives require owner confirmation. Third-party services have their own privacy terms and practices.",
        ],
    },
    {
        title: "Your privacy choices and rights",
        paragraphs: [
            "Depending on where you live, you may have rights to request access to, correction of, or deletion of personal information, or to object to certain processing. The rights available and the process for exercising them depend on applicable law and the ministry's data practices; please contact the ministry to make a request.",
        ],
    },
    {
        title: "Policy updates",
        paragraphs: [
            "This policy may be updated as the website or its data practices change. The current version will be posted on this page. The owner should add an effective or last-updated date when approving the policy.",
        ],
    },
];

export default function PrivacyPolicy() {
    return <>
        <SEO title="Privacy Policy - Royal HigherLife Christian Ministries" description="Privacy information for the Royal HigherLife Christian Ministries website." url="/privacy" type="website" />
        <section className="about-section">
            <div className="container">
                <header className="page-header">
                    <h1 className="section-title">Privacy Policy</h1>
                    <p className="section-subtitle">How information may be handled when you use the Royal HigherLife Christian Ministries website.</p>
                </header>
                <article className="card single-card">
                    <p><strong>Owner review required:</strong> This page identifies operational details that the ministry must confirm before relying on it as a complete privacy notice.</p>
                    {sections.map(({ title, paragraphs }) => <section key={title}><h2>{title}</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
                    <section>
                        <h2>Contact information</h2>
                        <p>For privacy questions or requests, contact the ministry through the <Link to="/contact">Contact page</Link>. The owner should confirm the appropriate contact channel and response process.</p>
                    </section>
                    <p>See also our <Link to="/terms">Terms of Service</Link>.</p>
                    <p><Link to="/">Return Home</Link></p>
                </article>
            </div>
        </section>
    </>;
}
