import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicSermons, getPublicEvents, getPublicReviews, getPublicSiteContent, getPublicAnnouncements, getPublicMinistries } from "../services/publicContentService";
import Hero from "../Components/Hero.jsx";
import PrayerForm from "../Components/PrayerForm.jsx";
import TestimonyForm from "../Components/TestimonyForm.jsx";
import SEO from "../Components/SEO.jsx";

const asset = (path) => new URL(`../assets/${path}`, import.meta.url).href;

export default function Home() {
    const [siteContent, setSiteContent] = useState({});
    const [publicMinistries, setPublicMinistries] = useState([]);
    useEffect(() => { getPublicSiteContent().then((response) => setSiteContent(response.data?.data || {})).catch(() => {}); }, []);
    useEffect(() => { getPublicMinistries().then((response) => setPublicMinistries(Array.isArray(response.data?.data) ? response.data.data : [])).catch(() => {}); }, []);
    const visibleActivities = publicMinistries.length ? publicMinistries.map((item) => ({
<<<<<<< HEAD
        title: item.name, description: item.description, icon: item.image ? <img src={item.image} alt="" className="h-12 w-12 rounded-full object-cover" /> : "✦", link: "/about#activities",
=======
        title: item.name, description: item.description, icon: item.image ? <img src={item.image} alt="" className="h-12 w-12 rounded-full object-cover" /> : item.name.substring(0, 2), link: "/about#activities",
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
    })) : ministryActivities;
    return (
        <>
            <SEO
                title="Welcome to Royal HigherLife Christian Ministries"
                description="Royal HigherLife Christian Ministries (Outreach) is committed to spreading the Gospel of Jesus Christ through evangelism, discipleship, and compassionate outreach across Nigeria, Benin Republic, and Togo."
                url="/"
                type="website"
            />

            {/* HERO SECTION */}
            <Hero title={siteContent.heroHeading || "Welcome to Royal HigherLife"} image={siteContent.heroImageUrl || undefined} ctaText={siteContent.heroCtaText} ctaLink={siteContent.heroCtaLink}>
                {siteContent.heroDescription || "Royal HigherLife Christian Ministries (Outreach) is committed to spreading the Gospel of Jesus Christ through evangelism, discipleship, and compassionate outreach."}
            </Hero>

            {/* WELCOME SECTION */}
            <section id="welcome" className="welcome-section">
                <div className="container page-container">
                    <h2 className="section-title section-title-left">{siteContent.welcomeHeading || "A Place to Belong, Believe &amp; Become"}</h2>
                    <div className="welcome-content">
                        <div className="welcome-text">
<<<<<<< HEAD
                            <span className="section-eyebrow">Welcome Message</span>
                            <h2 className="section-title">{siteContent.welcomeHeading || "A Place to Belong, Believe & Become"}</h2>
                            <p className="welcome-intro">
                                {siteContent.welcomeText || `At Royal HigherLife Christian Ministries, we believe everyone has a divine purpose.
                                Whether you're seeking God for the first time or looking for a spiritual home,
                                you'll find a warm welcome, biblical teaching, and a community committed to
=======
                            <p className="welcome-intro">
                                {siteContent.welcomeText || `At Royal HigherLife Christian Ministries, we believe everyone has a divine purpose.
                                Whether you're seeking God for the first time or looking for a spiritual home, 
                                you'll find a warm welcome, biblical teaching, and a community committed to 
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
                                living the higher life in Christ.`}
                            </p>
                            <p className="welcome-details">
                                Founded on the principles of evangelism, discipleship, and compassionate outreach,
                                our ministry spans across Nigeria, Republic of Benin, and Togo — planting churches,
                                reaching the lost, and raising a generation of believers who impact nations through
                                the power of the Gospel.
                            </p>
                            <Link to="/about" className="btn btn-primary">
                                Read More About Us
                            </Link>
                        </div>
                        <div className="welcome-image">
<<<<<<< HEAD
                            <img
                                src={asset("welcome pics.jpeg")}
                                alt="Royal HigherLife Ministries Welcome"
=======
                            <img 
                                src={asset("welcome pics.jpeg")} 
                                alt="Royal HigherLife Ministries welcome gathering" 
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* ABOUT THE MINISTRY - QUICK OVERVIEW */}
            <section id="about-overview" className="about-overview-section">
                <div className="container">
                    <div className="page-header">
                        <span className="section-eyebrow">Who We Are</span>
                        <h2 className="section-title">About the Ministry</h2>
                        <p className="section-subtitle">
                            Called to reach. Committed to disciple. Anointed to transform.
                        </p>
                    </div>

                    <div className="about-grid">
                        <article className="about-card">
                            <div className="about-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3>Our Vision</h3>
                            <p>
                                {siteContent.vision || `To raise a generation of believers who live the higher life of holiness in Christ and impact their communities and nations through the power of the Gospel.`}
                            </p>
                        </article>

                        <article className="about-card">
                            <div className="about-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3>Our Mission</h3>
                            <p>
                                {siteContent.mission || `To proclaim the Gospel of Jesus Christ through evangelism and outreach, raise disciples through the teaching of God's Word, and empower believers to live holy and victorious lives by the power of the Holy Spirit.`}
                            </p>
                        </article>

                        <article className="about-card">
                            <div className="about-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3>Core Beliefs</h3>
                            <p>
                                {siteContent.coreBeliefs || `We hold to 18 foundational doctrines including the Trinity, salvation by grace, sanctification, baptism of the Holy Spirit, divine healing, and the second coming of Jesus Christ.`}
                            </p>
                        </article>

                        <article className="about-card">
                            <div className="about-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3>Ministry Purpose</h3>
                            <p>
                                We exist to reach the unreached, plant churches in strategic communities, support
                                the needy, distribute Bibles, and equip ministers for effective kingdom service.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* LATEST SERMONS */}
            <LatestSermons />

            {/* UPCOMING EVENTS */}
            <UpcomingEvents />

            {/* PUBLISHED ANNOUNCEMENTS */}
            <LatestAnnouncements />

            {/* MINISTRY ACTIVITIES */}
=======
            {/* MINISTRY WORK */}
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
            <section id="ministry-activities" className="activities-section">
                <div className="container page-container">
                    <h2 className="section-title section-title-left">Ministry Activities</h2>
                    <p className="section-intro">
                        Five pillars of our outreach, each transforming lives for God's glory.
                    </p>
                    <div className="activities-grid">
                        {visibleActivities.map((activity, index) => (
                            <article key={publicMinistries[index]?._id || index} className="activity-card">
<<<<<<< HEAD
                                <div className="activity-icon">{activity.icon}</div>
=======
                                <div className="activity-icon">
                                    {typeof activity.icon === "string" ? (
                                        <span className="activity-badge">{activity.icon}</span>
                                    ) : (
                                        activity.icon
                                    )}
                                </div>
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
                                <h3 className="activity-title">{activity.title}</h3>
                                <p className="activity-description">{activity.description}</p>
                                <Link to={activity.link} className="activity-link">
                                    Explore <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* LATEST SERMONS */}
            <LatestSermons />

            {/* UPCOMING EVENTS */}
            <UpcomingEvents />

            {/* PUBLISHED ANNOUNCEMENTS */}
            <LatestAnnouncements />

            {/* TESTIMONIES */}
            <section id="testimonies" className="testimonies-section">
                <div className="container page-container">
                    <h2 className="section-title section-title-left">Testimonies</h2>
                    <p className="section-intro">
                        Real stories of God's faithfulness and transforming power.
                    </p>
                    <LatestTestimonies />
<<<<<<< HEAD

                    <TestimonyForm />

                    <div className="section-cta">
=======
                    <div className="section-cta" style={{ marginTop: "2rem" }}>
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
                        <Link to="/reviews" className="btn btn-outline">
                            Read More Testimonies
                        </Link>
                    </div>
                    <TestimonyForm />
                </div>
            </section>

            {/* PRAYER REQUEST */}
            <section id="prayer" className="prayer-section">
                <div className="container page-container">
                    <h2 className="section-title section-title-left">We're Here to Pray With You</h2>
                    <div className="prayer-content">
                        <div className="prayer-info">
                            <p className="prayer-intro">
                                Whatever you're facing — illness, financial pressure, family struggles,
                                or spiritual warfare — our prayer team is ready to stand with you in faith.
                            </p>
                            <ul className="prayer-features">
                                <li>Confidential &amp; Respectful</li>
                                <li>Prayed Over by Our Team</li>
                                <li>Follow-up Available</li>
                            </ul>
                        </div>
                        <div className="prayer-form-wrapper">
                            <PrayerForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* GIVING SECTION */}
            <section id="giving" className="giving-section">
                <div className="container page-container">
                    <h2 className="section-title section-title-left">Sow Into The Harvest</h2>
                    <div className="giving-content">
                        <div className="giving-info">
                            <p className="giving-intro">
                                Your generosity fuels church planting, evangelism, community development,
                                Bible distribution, and leadership training across nations. Every gift
                                makes an eternal impact.
                            </p>
                            <div className="giving-methods">
                                <h4>Ways to Give</h4>
                                <ul>
                                    <li>
                                        <div>
                                            <strong>Bank Transfer</strong>
                                            <span>Contact ministry for account details</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <strong>Mobile Money</strong>
                                            <span>Available in Nigeria, Benin &amp; Togo</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <strong>Online Giving</strong>
                                            <span>Secure payment portal coming soon</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <p className="giving-scripture">
                                <em>"Give, and it will be given to you. Good measure, pressed down, shaken together, running over..."</em> — Luke 6:38
                            </p>
                        </div>
                        <div className="giving-cta">
                            <Link to="/donate" className="btn btn-primary">
                                Give Now
                            </Link>
                            <p className="giving-note">
                                Secure giving • Tax-deductible receipts available • 100% goes to ministry
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

// Ministry Activities Data
const ministryActivities = [
    {
        icon: "WORSHIP",
        title: "Worship",
        description: "Spirit-filled worship sessions that usher in God's presence and transform atmospheres.",
        link: "/gallery#worship"
    },
    {
        icon: "PRAYER",
        title: "Prayer",
        description: "Dedicated intercession and prayer meetings for healing, breakthrough, and revival.",
        link: "/contact#prayerForm"
    },
    {
        icon: "EVANGELISM",
        title: "Evangelism",
        description: "Taking the Gospel to streets, villages, and communities across nations.",
        link: "/mission#evangelism"
    },
    {
        icon: "OUTREACH",
        title: "Outreach",
        description: "Compassionate outreach to the needy, prisons, hospitals, and underserved communities.",
        link: "/mission#community"
    },
    {
        icon: "COMMUNITY",
        title: "Community Development",
        description: "Building schools, clinics, and sustainable projects that transform entire communities.",
        link: "/about#mission"
    },
];

function LatestTestimonies() {
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function loadTestimonies() {
        setLoading(true);
        setError(false);
        try {
            const response = await getPublicReviews();
            setTestimonies(Array.isArray(response.data.data) ? response.data.data.slice(0, 3) : []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTestimonies();
    }, []);

    if (loading) return <div className="no-content" role="status">Loading approved testimonies…</div>;
    if (error) {
        return (
            <div className="no-content" role="alert">
                <p>Approved testimonies are temporarily unavailable.</p>
                <button className="btn btn-outline" type="button" onClick={loadTestimonies}>Retry</button>
            </div>
        );
    }
    if (!testimonies.length) return <div className="no-content"><p>No testimonies available yet.</p></div>;

    return (
        <div className="testimonies-grid">
            {testimonies.map((testimony) => (
                <article className="testimony-card" key={testimony._id || testimony.createdAt}>
                    <div className="testimony-content">
                        <div className="testimony-rating" aria-label={`${testimony.rating || 0} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => <span key={index}>{index < (testimony.rating || 0) ? "★" : "☆"}</span>)}
                        </div>
                        <p className="testimony-text">{testimony.message}</p>
                        <div className="testimony-author">
                            <div className="author-avatar" aria-hidden="true">{testimony.name?.charAt(0)?.toUpperCase() || "R"}</div>
                            <div><h4>{testimony.name}</h4><span>Royal HigherLife Community</span></div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

function LatestAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    useEffect(() => { getPublicAnnouncements().then((response) => setAnnouncements(Array.isArray(response.data?.data) ? response.data.data.slice(0, 3) : [])).catch(() => setAnnouncements([])); }, []);
    if (!announcements.length) return null;
<<<<<<< HEAD
    return <section className="activities-section" aria-labelledby="latest-announcements-title"><div className="container"><div className="page-header"><span className="section-eyebrow">Stay connected</span><h2 id="latest-announcements-title" className="section-title">Ministry News & Announcements</h2></div><div className="activities-grid">{announcements.map((item) => <article key={item._id} className="activity-card">{item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" />}<h3>{item.title}</h3><p>{item.content || item.message}</p><time dateTime={item.publishAt || item.createdAt}>{new Date(item.publishAt || item.createdAt).toLocaleDateString()}</time></article>)}</div></div></section>;
=======
    return <section className="activities-section" aria-labelledby="latest-announcements-title"><div className="container page-container"><h2 className="section-title section-title-left">Ministry News &amp; Announcements</h2><div className="activities-grid">{announcements.map((item) => <article key={item._id} className="activity-card">{item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" />}<h3>{item.title}</h3><p>{item.content || item.message}</p><time dateTime={item.publishAt || item.createdAt}>{new Date(item.publishAt || item.createdAt).toLocaleDateString()}</time></article>)}</div></div></section>;
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
}

// Latest Sermons Component
function LatestSermons() {
    const [latestSermons, setLatestSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function loadSermons() {
        setLoading(true);
        setError(false);
        try {
            const response = await getPublicSermons();
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            const sorted = [...data].sort((a, b) => new Date(b.sermonDate || b.date || 0) - new Date(a.sermonDate || a.date || 0));
            setLatestSermons(sorted.slice(0, 3));
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadSermons(); }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const isYouTubeUrl = (url) => {
        return url && (url.includes("youtube.com") || url.includes("youtu.be"));
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYouTubeThumbnail = (url) => {
        const id = getYouTubeId(url);
        return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
    };

    return (
        <section id="latest-sermons" className="sermons-home-section">
            <div className="container page-container">
                <h2 className="section-title section-title-left">Latest Sermons</h2>
                <p className="section-intro">
                    Be encouraged, challenged, and transformed by the preaching of God's Word.
                </p>

                {loading ? (
                    <div className="sermons-grid">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="sermon-card skeleton">
                                <div className="skeleton-image" style={{ aspectRatio: "16/9" }}></div>
                                <div className="skeleton-text" style={{ height: "140px", padding: "1.5rem" }}></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="no-content" role="alert">
                        <p>Sermons are temporarily unavailable. Please try again.</p>
                        <button className="btn btn-outline" type="button" onClick={loadSermons}>Retry</button>
                    </div>
                ) : latestSermons.length === 0 ? (
                    <div className="no-content">
                        <p>No sermons available yet. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        <div className="sermons-grid">
                            {latestSermons.map((sermon) => (
                                <article key={sermon._id} className="sermon-card">
                                    <div className="sermon-thumbnail">
                                        {isYouTubeUrl(sermon.videoUrl) ? (
                                            <>
                                                <img
                                                    src={getYouTubeThumbnail(sermon.videoUrl) || sermon.image || sermon.imageUrl || asset("royal3.jpeg")}
                                                    alt={sermon.title}
                                                    loading="lazy"
                                                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = asset("royal3.jpeg"); }}
                                                />
                                                <Link
                                                    to={`/sermons/${sermon._id}`}
<<<<<<< HEAD


=======
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
                                                    className="play-button"
                                                    aria-label={`Watch: ${sermon.title}`}
                                                >
                                                    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </Link>
                                            </>
                                        ) : sermon.videoUrl ? (
                                            <>
                                                <video
                                                    src={sermon.videoUrl}
                                                    poster={sermon.image || sermon.imageUrl || asset("royal3.jpeg")}
                                                    muted
                                                    preload="metadata"
                                                    onError={(event) => { event.currentTarget.poster = asset("royal3.jpeg"); }}
                                                />
                                                <Link
                                                    to={`/sermons/${sermon._id}`}
<<<<<<< HEAD


=======
>>>>>>> c67da29 (Admin updates, SEO, legal pages, and UI changes)
                                                    className="play-button"
                                                    aria-label={`Watch: ${sermon.title}`}
                                                >
                                                    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </Link>
                                            </>
                                        ) : (
                                            <img
                                                src={sermon.image || sermon.imageUrl || asset("royal3.jpeg")}
                                                alt={sermon.title}
                                                loading="lazy"
                                                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = asset("royal3.jpeg"); }}
                                            />
                                        )}
                                        {sermon.category && (
                                            <span className="sermon-category">{sermon.category}</span>
                                        )}
                                    </div>

                                    <div className="sermon-content">
                                        <h3 className="sermon-title">{sermon.title}</h3>

                                        <div className="sermon-meta">
                                            <span className="sermon-speaker">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {sermon.speaker || sermon.preacher}
                                            </span>
                                            <span className="sermon-date">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(sermon.sermonDate || sermon.date)}
                                            </span>
                                        </div>

                                        {sermon.scripture && (
                                            <p className="sermon-scripture">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                {sermon.scripture}
                                            </p>
                                        )}

                                        <p className="sermon-availability">
                                            {sermon.videoUrl ? "Video available" : sermon.audioUrl ? "Audio available" : "Message details"}
                                            {sermon.videoUrl && sermon.audioUrl ? " · Audio available" : ""}
                                        </p>

                                        <Link
                                            to={sermon._id ? `/sermons/${sermon._id}` : "/sermons"}
                                            className="btn btn-primary watch-btn"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {sermon.videoUrl ? "Watch Now" : "View All Sermons"}
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className="section-cta" style={{ marginTop: "2rem" }}>
                            <Link to="/sermons" className="btn btn-outline">
                                View All Sermons
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

// Upcoming Events Component
function UpcomingEvents() {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    async function loadEvents() {
        setLoading(true);
        setError(false);
        try {
            const response = await getPublicEvents();
            const data = Array.isArray(response.data.data) ? response.data.data : [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const upcoming = data
                .filter((event) => {
                    const date = new Date(event.date);
                    return !Number.isNaN(date.getTime()) && date >= today;
                })
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3);
            setUpcomingEvents(upcoming);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadEvents(); }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    return (
        <section id="upcoming-events" className="events-home-section">
            <div className="container page-container">
                <h2 className="section-title section-title-left">Upcoming Events</h2>
                <p className="section-intro">
                    Join us for powerful gatherings, conferences, and ministry events.
                </p>

                {loading ? (
                    <div className="events-grid">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="event-card skeleton">
                                <div className="skeleton-image" style={{ aspectRatio: "16/9" }}></div>
                                <div className="skeleton-text" style={{ height: "160px", padding: "1.5rem" }}></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="no-content" role="alert">
                        <p>Events are temporarily unavailable. Please try again.</p>
                        <button className="btn btn-outline" type="button" onClick={loadEvents}>Retry</button>
                    </div>
                ) : upcomingEvents.length === 0 ? (
                    <div className="no-content">
                        <p>No upcoming events at this time. Check back soon!</p>
                    </div>
                ) : (
                    <>
                        <div className="events-grid">
                            {upcomingEvents.map((event) => (
                                <article key={event._id} className="event-card">
                                    <div className="event-image">
                                        <img
                                            src={event.image || event.imageUrl || asset("royal3.jpeg")}
                                            alt={event.title}
                                            loading="lazy"
                                            onError={(imageEvent) => { imageEvent.currentTarget.onerror = null; imageEvent.currentTarget.src = asset("royal3.jpeg"); }}
                                        />
                                        {event.status && (
                                            <span className={`event-status ${event.status}`}>{event.status}</span>
                                        )}
                                    </div>

                                    <div className="event-content">
                                        <div className="event-meta">
                                            <span className="event-date">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {formatDate(event.date)}
                                            </span>
                                            {event.time && (
                                                <span className="event-time">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {event.time}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="event-title">{event.title}</h3>

                                        {event.location && (
                                            <p className="event-location">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {event.location}
                                            </p>
                                        )}

                                        <p className="event-description">{event.description}</p>

                                        <div className="event-actions">
                                            <Link to="/events" className="btn btn-primary">
                                                Event Details &amp; Registration
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className="section-cta" style={{ marginTop: "2rem" }}>
                            <Link to="/events" className="btn btn-outline">
                                View All Events
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
