import { Link } from "react-router-dom";
import SEO from "../Components/SEO.jsx";

const sections = [
    { title: "Acceptance of terms", paragraphs: ["By accessing or using this website, you agree to these terms. If you do not agree, do not use the website. The ministry should confirm any additional terms that apply to specific services."] },
    { title: "Website usage and user responsibilities", paragraphs: ["You may use this website to learn about Royal HigherLife Christian Ministries, view its published content, contact the ministry, submit prayer requests, register for events, and make donations through the available channels.", "Use the website lawfully and respectfully. Do not attempt to disrupt its operation, gain unauthorized access, impersonate another person, or submit content that is unlawful, harmful, or infringes another person's rights. Provide accurate information when using forms."] },
    { title: "Prayer requests and contact submissions", paragraphs: ["When sending a prayer request or contact message, provide information you are comfortable sharing and ensure it is accurate to the best of your knowledge. Avoid including sensitive information that is not needed to respond.", "The ministry may use the details you submit to respond to your request. Read the Privacy Policy for information about handling submitted personal information."] },
    { title: "Donations and payments", paragraphs: ["Donation amounts, payment options, and transaction terms shown during a donation are governed by the information displayed at the time of the transaction and the applicable payment provider's terms.", "No refund or tax treatment policy is stated here. The ministry should confirm and publish any applicable donation, refund, or tax information before relying on it."] },
    { title: "Event registrations", paragraphs: ["Event details, registration requirements, and any applicable charges will be presented with the relevant event or registration. Follow the instructions shown there. The ministry should confirm any cancellation, transfer, or refund rules that apply to individual events."] },
    { title: "Intellectual property", paragraphs: ["Website text, images, recordings, logos, and other materials may belong to the ministry or their respective rights holders. You may view them for personal, non-commercial purposes. Obtain permission from the relevant rights holder before reproducing or distributing material, except where applicable law permits otherwise."] },
    { title: "External links", paragraphs: ["This website may link to services or websites operated by others. Those links are provided for convenience. The ministry does not control third-party content, services, or privacy practices; review their terms before using them."] },
    { title: "Limitation of liability", paragraphs: ["The website and its content are provided for general information and may change or become temporarily unavailable. To the extent permitted by applicable law, the ministry makes no guarantee that the website will always be available, uninterrupted, or error-free.", "Nothing in these terms excludes or limits liability where applicable law does not allow that exclusion or limitation. The ministry should have these terms reviewed for the laws and jurisdictions applicable to its operations."] },
    { title: "Changes to these terms", paragraphs: ["These terms may be updated as the website or ministry practices change. The current version will be posted on this page. Please review it from time to time."] },
];

export default function TermsOfService() {
    return <>
        <SEO title="Terms of Service - Royal HigherLife Christian Ministries" description="Terms for using the Royal HigherLife Christian Ministries website." url="/terms" type="website" />
        <section className="about-section">
            <div className="container">
                <header className="page-header">
                    <h1 className="section-title">Terms of Service</h1>
                    <p className="section-subtitle">Please read these terms when using the Royal HigherLife Christian Ministries website.</p>
                </header>
                <article className="card single-card">
                    <h2>Introduction</h2>
                    <p>These terms describe general conditions for using this website. By continuing to use the website, you agree to follow these terms. If you do not agree, please discontinue use of the website.</p>
                    {sections.map(({ title, paragraphs }) => <section key={title}><h2>{title}</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
                    <section>
                        <h2>Contact information</h2>
                        <p>For questions about these terms, contact the ministry through the <Link to="/contact">Contact page</Link>.</p>
                        <p><strong>Owner review required:</strong> Confirm preferred contact details, governing law, and effective date before treating this page as final legal terms.</p>
                    </section>
                    <p><Link to="/">Return Home</Link></p>
                </article>
            </div>
        </section>
    </>;
}
