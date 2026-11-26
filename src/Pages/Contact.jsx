import ContactForm from "../Components/ContactForm.jsx";
import PrayerForm from "../Components/PrayerForm.jsx";
import { useEffect, useRef, useState } from "react";
import { getPublicSiteContent } from "../services/publicContentService";

export default function Contact() {
    const [siteContent, setSiteContent] = useState({});
    const [activeFormTab, setActiveFormTab] = useState("contact");
    const contactTabRef = useRef(null);
    const prayerTabRef = useRef(null);
    useEffect(() => { getPublicSiteContent().then((response) => setSiteContent(response.data?.data || {})).catch(() => {}); }, []);

    function selectFormTab(tab, focusTab = false) {
        setActiveFormTab(tab);
        if (focusTab) {
            requestAnimationFrame(() => (tab === "contact" ? contactTabRef : prayerTabRef).current?.focus());
        }
    }

    function handleFormTabKeyDown(event) {
        const tabs = ["contact", "prayer"];
        const currentIndex = tabs.indexOf(activeFormTab);
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            selectFormTab(tabs[(currentIndex + 1) % tabs.length], true);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            selectFormTab(tabs[(currentIndex + tabs.length - 1) % tabs.length], true);
        } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            selectFormTab(event.key === "Home" ? tabs[0] : tabs[tabs.length - 1], true);
        }
    }

    return (
        <>
            {(siteContent.phone || siteContent.email || siteContent.address || siteContent.officeHours) && (
                <section className="container py-8" aria-label="Ministry contact details">
                    <h1>Contact Royal HigherLife</h1>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[["Phone", siteContent.phone], ["Email", siteContent.email], ["Address", siteContent.address], ["Office information", siteContent.officeHours]].filter(([, value]) => value).map(([label, value]) => (
                <article
                    key={label}
                    className="rounded-xl border border-slate-200 p-4"
                    style={{
                        backgroundColor: "var(--panel-2)",
                        color: "var(--text)",
                    }}
                >
                    <h2 className="font-semibold">{label}</h2>
                    <p style={{ color: "var(--text-muted)" }}>{value}</p>
                </article>
                        ))}
                    </div>
                </section>
            )}
            <section id="Message" className="Message-section">
                <div className="container page-container">
                    <div className="Message-container contact-prayer-layout">
                        <div className="contact-prayer-tabs" role="tablist" aria-label="Contact or prayer form" onKeyDown={handleFormTabKeyDown}>
                            <button
                                ref={contactTabRef}
                                id="contact-form-tab"
                                type="button"
                                role="tab"
                                aria-selected={activeFormTab === "contact"}
                                aria-controls="contact-form-panel"
                                tabIndex={activeFormTab === "contact" ? 0 : -1}
                                onClick={() => selectFormTab("contact")}
                            >
                                Contact Us
                            </button>
                            <button
                                ref={prayerTabRef}
                                id="prayer-form-tab"
                                type="button"
                                role="tab"
                                aria-selected={activeFormTab === "prayer"}
                                aria-controls="prayer-form-panel"
                                tabIndex={activeFormTab === "prayer" ? 0 : -1}
                                onClick={() => selectFormTab("prayer")}
                            >
                                Prayer Request
                            </button>
                        </div>
                        <div className="contact-prayer-panels">
                            <section
                                id="contact-form-panel"
                                className="contact-prayer-panel"
                                data-active={activeFormTab === "contact"}
                                role="tabpanel"
                                aria-labelledby="contact-form-tab"
                                tabIndex={0}
                            >
                                <ContactForm />
                            </section>
                            <section
                                id="prayer-form-panel"
                                className="contact-prayer-panel"
                                data-active={activeFormTab === "prayer"}
                                role="tabpanel"
                                aria-labelledby="prayer-form-tab"
                                tabIndex={0}
                            >
                                <PrayerForm />
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
