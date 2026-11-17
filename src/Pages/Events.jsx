import { useState, useEffect } from "react";
import { getPublicEvents } from "../services/publicContentService";
import EventRegistrationForm from "../Components/EventRegistrationForm.jsx";

const asset = (path) => new URL(`../assets/${path}`, import.meta.url).href;

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fetch events from API
    const fetchEvents = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await getPublicEvents();
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setEvents(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Separate upcoming and past events
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const validEvents = events.filter((event) => !Number.isNaN(new Date(event.date).getTime()));
    const upcomingEvents = validEvents.filter(e => new Date(e.date) >= startOfToday).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastEvents = validEvents.filter(e => new Date(e.date) < startOfToday).sort((a, b) => new Date(b.date) - new Date(a.date));

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { 
            weekday: "long",
            year: "numeric", 
            month: "long", 
            day: "numeric" 
        });
    };

    // Format time
    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const currentEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;
    const emptyMessage = activeTab === "upcoming" 
        ? "No upcoming events scheduled. Check back soon!"
        : "No past events found.";

    return (
        <section className="events-section" id="events">
            <div className="container">
                <div className="page-header">
                    <h1 className="section-title">Events</h1>
                    <p className="section-subtitle">
                        Join us for worship, fellowship, and ministry events. All are welcome!
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="events-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={activeTab === "upcoming"}
                        onClick={() => setActiveTab("upcoming")}
                        className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upcoming ({upcomingEvents.length})
                    </button>
                    <button
                        role="tab"
                        aria-selected={activeTab === "past"}
                        onClick={() => setActiveTab("past")}
                        className={`tab-btn ${activeTab === "past" ? "active" : ""}`}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Past Events ({pastEvents.length})
                    </button>
                </div>

                {/* Events Grid */}
                <div className="events-grid" role="tabpanel">
                    {loading ? (
                        <div className="loading-state" aria-live="polite">
                            <div className="spinner" aria-hidden="true"></div>
                            <p>Loading events...</p>
                        </div>
                    ) : error ? (
                        <div className="no-events" role="alert">
                            <h3>Events are temporarily unavailable</h3>
                            <p>Please check your connection and try again.</p>
                            <button className="btn btn-primary" type="button" onClick={fetchEvents}>Retry</button>
                        </div>
                    ) : currentEvents.length === 0 ? (
                        <div className="no-events">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3>{activeTab === "upcoming" ? "No Upcoming Events" : "No Past Events"}</h3>
                            <p>{emptyMessage}</p>
                        </div>
                    ) : (
                        currentEvents.map((event) => (
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
                                                {formatTime(event.time)}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="event-title">{event.title}</h3>
                                    
                                    {event.location && (
                                        <p className="event-location">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </p>
                                    )}

                                    {event.category && (
                                        <span className="event-category">{event.category}</span>
                                    )}

                                    <p className="event-description">{event.description}</p>

                                    <div className="event-actions">
                                        {activeTab === "upcoming" && event.capacity && event.capacity > 0 && (
                                            <span className="event-capacity">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {event.registrations || 0} / {event.capacity} registered
                                            </span>
                                        )}
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setSelectedEvent(event)}
                                        >
                                            {activeTab === "upcoming" ? "Register" : "View Details"}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)} role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="Close modal">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div className="modal-image">
                            <img src={selectedEvent.image || selectedEvent.imageUrl || asset("royal3.jpeg")} alt={selectedEvent.title} onError={(imageEvent) => { imageEvent.currentTarget.onerror = null; imageEvent.currentTarget.src = asset("royal3.jpeg"); }} />
                        </div>
                        
                        <div className="modal-body">
                            <div className="modal-meta">
                                <span className="event-date">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(selectedEvent.date)}
                                </span>
                                {selectedEvent.time && (
                                    <span className="event-time">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatTime(selectedEvent.time)}
                                    </span>
                                )}
                                {selectedEvent.location && (
                                    <span className="event-location">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {selectedEvent.location}
                                    </span>
                                )}
                            </div>

                            <h2 id="event-modal-title" className="modal-title">{selectedEvent.title}</h2>
                            
                            {selectedEvent.category && (
                                <span className="event-category">{selectedEvent.category}</span>
                            )}

                            <div className="modal-description">
                                <p>{selectedEvent.description}</p>
                            </div>

                            {selectedEvent.capacity && selectedEvent.capacity > 0 && (
                                <div className="modal-capacity">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{selectedEvent.registrations || 0} of {selectedEvent.capacity} seats filled</span>
                                    <div className="capacity-bar">
                                        <div 
                                            className="capacity-fill" 
                                            style={{ width: `${Math.min(100, ((selectedEvent.registrations || 0) / selectedEvent.capacity) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions">
                                {activeTab === "upcoming" && (
                                    <EventRegistrationForm eventId={selectedEvent._id} eventName={selectedEvent.title} />
                                )}
                                <button className="btn btn-outline" onClick={() => setSelectedEvent(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
