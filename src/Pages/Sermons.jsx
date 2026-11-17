import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPublicSermons } from "../services/publicContentService";

const asset = (path) => new URL(`../assets/${path}`, import.meta.url).href;

export default function Sermons() {
    const navigate = useNavigate();
    const [sermons, setSermons] = useState([]);
    const [filteredSermons, setFilteredSermons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSpeaker, setSelectedSpeaker] = useState("all");
    const [categories, setCategories] = useState([]);
    const [speakers, setSpeakers] = useState([]);

    // Fetch sermons from API
    const fetchSermons = async () => {
        try {
            const res = await getPublicSermons();
            const data = res.data.data || [];
            setSermons(data);
            setFilteredSermons(data);
            
            // Extract unique categories and speakers
            const uniqueCategories = [...new Set(data.map(s => s.category).filter(Boolean))];
            const uniqueSpeakers = [...new Set(data.map(s => s.speaker || s.preacher).filter(Boolean))];
            setCategories(uniqueCategories);
            setSpeakers(uniqueSpeakers);
        } catch (err) {
            console.error("Failed to fetch sermons:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSermons();
    }, []);

    // Filter sermons based on search and filters
    useEffect(() => {
        let result = sermons;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(s => 
                (s.title || "").toLowerCase().includes(term) ||
                (s.speaker || s.preacher || "").toLowerCase().includes(term) ||
                s.scripture?.toLowerCase().includes(term) ||
                s.description?.toLowerCase().includes(term)
            );
        }

        if (selectedCategory !== "all") {
            result = result.filter(s => s.category === selectedCategory);
        }

        if (selectedSpeaker !== "all") {
            result = result.filter(s => (s.speaker || s.preacher) === selectedSpeaker);
        }

        setFilteredSermons(result);
    }, [searchTerm, selectedCategory, selectedSpeaker, sermons]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
        });
    };

    // Check if video is YouTube
    const isYouTubeUrl = (url) => {
        return url && (url.includes("youtube.com") || url.includes("youtu.be"));
    };

    // Extract YouTube video ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Get thumbnail for YouTube video
    const getYouTubeThumbnail = (url) => {
        const id = getYouTubeId(url);
        return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
    };

    return (
        <section className="sermons-section" id="sermons">
            <div className="container">
                <div className="page-header">
                    <h1 className="section-title">Sermon Library</h1>
                    <p className="section-subtitle">
                        Watch and listen to life-changing messages from Royal Higher Life Ministries.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="sermons-filters">
                    <div className="search-box">
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Search sermons by title, speaker, scripture..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            aria-label="Search sermons"
                        />
                    </div>

                    <div className="filter-group">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                            aria-label="Filter by category"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            className="filter-select"
                            aria-label="Filter by speaker"
                        >
                            <option value="all">All Speakers</option>
                            {speakers.map(spk => (
                                <option key={spk} value={spk}>{spk}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-count">
                    {loading ? (
                        <p>Loading sermons...</p>
                    ) : (
                        <p>{filteredSermons.length} of {sermons.length} sermons found</p>
                    )}
                </div>

                {/* Sermons Grid */}
                {!loading && filteredSermons.length === 0 && (
                    <div className="no-results">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3>{sermons.length === 0 ? "No sermons available yet" : "No sermons found"}</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}

                <div className="sermons-grid" role="list">
                    {filteredSermons.map((sermon) => (
                        <article key={sermon._id} className="sermon-card" role="listitem">
                            <div className="sermon-thumbnail">
                                {isYouTubeUrl(sermon.videoUrl) ? (
                                    <>
                                        <img 
                                            src={getYouTubeThumbnail(sermon.videoUrl) || sermon.image || sermon.imageUrl || asset("royal3.jpeg")} 
                                            alt={sermon.title}
                                            loading="lazy"
                                        />
                                        <button 
                                            className="play-button"
                                            onClick={() => navigate(`/sermons/${sermon._id}`)}
                                            aria-label={`Watch: ${sermon.title}`}
                                        >
                                            <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </button>
                                    </>
                                ) : sermon.videoUrl ? (
                                    <>
                                        <video 
                                            src={sermon.videoUrl} 
                                            poster={sermon.image || sermon.imageUrl || asset("royal3.jpeg")}
                                            muted
                                            preload="metadata"
                                        />
                                        <button 
                                            className="play-button"
                                            onClick={() => navigate(`/sermons/${sermon._id}`)}
                                            aria-label={`Watch: ${sermon.title}`}
                                        >
                                            <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <img 
                                        src={sermon.image || sermon.imageUrl || asset("royal3.jpeg")} 
                                        alt={sermon.title}
                                        loading="lazy"
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

                                {sermon.description && (
                                    <p className="sermon-description">{sermon.description}</p>
                                )}

                                {(sermon.videoUrl || sermon.audioUrl) && (
                                    <Link 
                                        to={`/sermons/${sermon._id}`}
                                        
                                        
                                        className="btn btn-primary watch-btn"
                                    >
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Watch Now
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}