import { CalendarDays, Heart, Home, Bell, Settings, LogOut, X, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const menu = [
  { icon: Home, title: "Dashboard", target: "overview" },
  { icon: Heart, title: "My Donations", target: "donations" },
  { icon: CalendarDays, title: "Events", target: "events" },
  { icon: BookOpen, title: "Prayer Requests", target: "prayer" },
  { icon: Bell, title: "Notifications", target: "notifications" },
  { icon: Settings, title: "Settings", target: "settings" },
];

export default function Sidebar({ onNavigate = () => {}, onLogout = () => {}, mobileOpen = false, onClose = () => {} }) {
  return (
    <aside className={`member-sidebar${mobileOpen ? " is-open" : ""}`} aria-label="Member navigation">
      <div className="member-brand"><span className="member-brand-mark">RH</span><span><strong>Royal Higher Life</strong><small>Christian Ministries</small></span><button className="member-sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={20} /></button></div>
      <nav className="member-side-nav">
        {menu.map(({ icon: Icon, title, target }, index) => <button key={title} className={index === 0 ? "is-active" : ""} onClick={() => onNavigate(target)}><Icon size={19} /><span>{title}</span>{title === "Notifications" && <span className="member-side-badge" aria-label="No unread notifications">0</span>}</button>)}
      </nav>
      <div className="member-side-bottom"><Link to="/" onClick={onClose}><Home size={18} />Back to website</Link><button onClick={onLogout}><LogOut size={18} />Logout</button></div>
    </aside>
  );
}
