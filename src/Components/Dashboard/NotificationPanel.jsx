import { Bell, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotificationPanel({ events = [] }) {
  return <section className="member-panel member-notifications">
    <div className="member-panel-heading"><div><h2>Notifications</h2><p>Updates for your account</p></div><Bell size={19} className="member-gold-icon" /></div>
    {events.length ? <div className="member-notification-list">{events.map((event) => <article className="member-notification-row" key={event._id || event.id}><span className="member-notification-icon"><CalendarDays size={18} /></span><div><strong>Upcoming event</strong><p>{event.title}</p><small>{new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}{event.time ? ` · ${event.time}` : ""}</small></div><span className="member-unread-dot" aria-label="Upcoming" /></article>)}</div> : <div className="member-notification-empty"><Bell size={24} /><strong>No new updates</strong><p>New account updates will appear here.</p></div>}
    <Link className="member-outline-button" to="/events">View events <ArrowRight size={16} /></Link>
  </section>;
}
