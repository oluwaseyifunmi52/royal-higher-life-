import ContactForm from "../Components/ContactForm.jsx";
import PrayerForm from "../Components/PrayerForm.jsx";
import { useEffect, useState } from "react";
import { getPublicSiteContent } from "../services/publicContentService";

export default function Contact() {
    const [siteContent, setSiteContent] = useState({});
    useEffect(() => { getPublicSiteContent().then((response) => setSiteContent(response.data?.data || {})).catch(() => {}); }, []);
    return (
        <>
            {(siteContent.phone || siteContent.email || siteContent.address || siteContent.officeHours) && <section className="container py-8" aria-label="Ministry contact details"><h1>Contact Royal HigherLife</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Phone", siteContent.phone], ["Email", siteContent.email], ["Address", siteContent.address], ["Office information", siteContent.officeHours]].filter(([, value]) => value).map(([label, value]) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-4"><h2 className="font-semibold">{label}</h2><p>{value}</p></article>)}</div></section>}
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
        </>
    );
}
