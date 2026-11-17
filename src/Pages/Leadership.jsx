import { useEffect, useState } from "react";
import { getPublicLeadership } from "../services/publicContentService";

export default function Leadership() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let active = true;
        getPublicLeadership()
            .then(({ data }) => { if (active) setLeaders(data.data || []); })
            .catch(() => { if (active) setFailed(true); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    return (
        <section className="leadership-section" id="leadership">
            <div className="container">
                <div className="page-header">
                    <h1 className="section-title">Our Leadership</h1>
                    <p className="section-subtitle">Called to serve, committed to the Gospel, and dedicated to the ministry’s mission.</p>
                </div>
                {loading ? (
                    <p className="no-content" role="status">Loading leadership profiles…</p>
                ) : failed ? (
                    <p className="no-content" role="status">Leadership profiles are not available right now.</p>
                ) : leaders.length === 0 ? (
                    <div className="no-content" role="status">
                        <h2>Leadership profiles coming soon</h2>
                        <p>Verified names, photographs, biographies, and responsibilities will appear here when the ministry adds them.</p>
                    </div>
                ) : (
                    <div className="team-grid">
                        {leaders.map((leader) => (
                            <article key={leader._id} className="team-card">
                                {leader.image && <div className="team-image"><img src={leader.image} alt={leader.name} loading="lazy" /></div>}
                                <div className="team-content">
                                    <span className="team-title">{leader.title}</span>
                                    <h2 className="team-name">{leader.name}</h2>
                                    <p className="team-bio">{leader.bio}</p>
                                    {leader.responsibilities?.length > 0 && <ul className="team-responsibilities">{leader.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
