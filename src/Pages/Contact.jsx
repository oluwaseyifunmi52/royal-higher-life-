import ContactForm from "../Components/ContactForm.jsx";
import PrayerForm from "../Components/PrayerForm.jsx";
import SocialLinks from "../Components/SocialLinks.jsx";

export default function Contact() {
    return (
        <>
            <section id="Message" className="Message-section">
                <div className="Message-container">
                    <div>
                        <ContactForm />
                    </div>
                    <div>
                        <PrayerForm />
                    </div>
                </div>
            </section>
            <SocialLinks />
        </>
    );
}