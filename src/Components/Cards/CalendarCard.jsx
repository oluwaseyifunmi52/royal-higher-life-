import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CalendarCard({ events = [], loading = false, error = "" }) {
  return <section className="member-panel member-calendar">
    <div className="member-panel-heading"><div><h2>Upcoming events</h2><p>Church calendar</p></div><CalendarDays size={19} className="member-gold-icon" /></div>
    {loading ? <p className="member-muted">Loading upcoming events…</p> : error ? <p className="member-muted" role="status">{error}</p> : events.length ? <div className="member-event-list">{events.slice(0, 3).map((event) => {
      const date = new Date(event.date);
      return <article className="member-event-row" key={event._id || event.id}><div className="member-event-date"><small>{date.toLocaleDateString(undefined, { month: "short" }).toUpperCase()}</small><strong>{date.toLocaleDateString(undefined, { day: "numeric" })}</strong></div><div className="member-event-info"><strong>{event.title}</strong><p>{event.time || "Time to be announced"}</p>{event.location && <small><MapPin size={12} />{event.location}</small>}</div></article>;
    })}</div> : <div className="member-calendar-empty"><CalendarDays size={25} /><p>No upcoming events are scheduled. Check back soon.</p></div>}
    <Link className="member-outline-button" to="/events">View full calendar <ArrowRight size={16} /></Link>
  </section>;
}
