import MissionCard from "../Components/Cards/MissionCard.jsx";

export default function Mission() {
    return (
        <section id="mission-project">
            <div className="mission-container">
                <h1>Mission Project</h1>
                <p>
                    Royal Higher Life Christian Ministries (Outreach) is committed to fulfilling the Great Commission by planting
                    churches, evangelizing communities, supporting the needy, and distributing the Word of God. Our purpose is to
                    reach the lost, disciple believers, and transform communities through practical and spiritual outreach
                    programs.
                </p>
            </div>
            <MissionCard id="church" title="1. Church Planting">
                We believe in expanding God's kingdom by establishing local churches in strategic communities and villages. We
                have planted churches in Olomore Village (Abeokuta), Fojubaye Village (Ogun State), and in the Republic of Benin
                (Save, Aguoa, and Asaaba). These churches continue to serve their communities.
            </MissionCard>
            <MissionCard id="evangelism" title="2. Evangelism">
                Evangelism is at the heart of our ministry. Through street evangelism, village outreach, and special campaigns,
                we have reached hundreds of souls with the Gospel of Jesus Christ across Nigeria, Togo, and the Republic of
                Benin.
            </MissionCard>
            <MissionCard
                actions={
                    <>
                        <a className="btn" href="/donate">
                            Give Today
                        </a>
                        <a className="btn" href="/contact">
                            Partner with Us
                        </a>
                    </>
                }
                id="community"
                title="3. Community Support"
            >
                We show God's love through practical action by supporting families with food, clothing, mentorship, and health
                awareness programs. We rely on partners and supporters to extend this impact.
            </MissionCard>
            <MissionCard title="4. Bible Distribution">
                We distribute Bibles and Christian literature across Nigeria, Togo, and Benin Republic to ensure everyone has
                access to God's Word for spiritual growth.
            </MissionCard>
        </section>
    );
}