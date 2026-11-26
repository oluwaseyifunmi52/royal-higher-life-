import MissionCard from "../Components/Cards/MissionCard.jsx";
import { BookOpen, Church, HandHeart, Megaphone } from "lucide-react";

export default function Mission() {
    return (
        <section className="mission-section" id="mission-project">
            <div className="mission-container">
                <div className="page-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <span className="section-eyebrow">Mission Projects</span>
                    <h1 className="section-title">Mission Work</h1>
                    <p className="section-subtitle">
                        Royal Higher Life Christian Ministries (Outreach) is committed to fulfilling the Great Commission by planting
                        churches, evangelizing communities, supporting the needy, and distributing the Word of God.
                    </p>
                </div>
            </div>

            {/* Featured project - full width */}
            <article className="mission-card mission-featured" id="church">
                <span className="mission-mobile-icon mission-mobile-feature-icon" aria-hidden="true"><Church /></span>
                <div className="mission-existing-icon" style={{ fontSize: "3rem", lineHeight: 1, flexShrink: 0 }}>⛪</div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: "1.7rem", marginBottom: "0.75rem" }}>Church Planting</h2>
                    <p>
                        We believe in expanding God's kingdom by establishing local churches in strategic communities and villages. We
                        have planted churches in Olomore Village (Abeokuta), Fojubaye Village (Ogun State), and in the Republic of Benin
                        (Save, Aguoa, and Asaaba). These churches continue to serve their communities.
                    </p>
                </div>
            </article>

            {/* Remaining projects - two column grid */}
            <div className="mission-grid">
                <MissionCard id="evangelism" icon={<Megaphone />} title="Evangelism">
                    Evangelism is at the heart of our ministry. Through street evangelism, village outreach, and special campaigns,
                    we have reached hundreds of souls with the Gospel of Jesus Christ across Nigeria, Togo, and the Republic of
                    Benin.
                </MissionCard>
                <MissionCard
                    actions={
                        <>
                            <a className="btn btn-primary" href="/donate">
                                Give Today
                            </a>
                            <a className="btn btn-outline" href="/contact">
                                Partner with Us
                            </a>
                        </>
                    }
                    id="community"
                    icon={<HandHeart />}
                    title="Community Support"
                >
                    We show God's love through practical action by supporting families with food, clothing, mentorship, and health
                    awareness programs. We rely on partners and supporters to extend this impact.
                </MissionCard>
                <MissionCard icon={<BookOpen />} title="Bible Distribution">
                    We distribute Bibles and Christian literature across Nigeria, Togo, and Benin Republic to ensure everyone has
                    access to God's Word for spiritual growth.
                </MissionCard>
            </div>
            <div className="mission-mobile-actions" aria-label="Mission support actions">
                <a className="btn btn-primary" href="/donate">Give Today</a>
                <a className="btn btn-outline" href="/contact">Partner with Us</a>
            </div>
        </section>
    );
}
