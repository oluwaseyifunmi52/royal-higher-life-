import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, CalendarDays, Heart, Menu, Search, SlidersHorizontal, UserRound,
} from "lucide-react";
import Sidebar from "../Components/Dashboard/Sidebar";
import DonationHistory from "../Components/Dashboard/DonationHistory";
import ActivityTimeline from "../Components/Dashboard/ActivityTimeline";
import NotificationPanel from "../Components/Dashboard/NotificationPanel";
import CalendarCard from "../Components/Cards/CalendarCard";
import DashboardEditProfile from "../Components/Dashboard/DashboardEditProfile";
import DashboardChangePassword from "../Components/Dashboard/DashboardChangePassword";
import DashboardUploadPicture from "../Components/Dashboard/DashboardUploadPicture";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { getPublicEvents } from "../services/publicContentService";
import { formatCurrency } from "../utils/currency";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "edit-profile", label: "Edit Profile" },
  { id: "change-password", label: "Change Password" },
  { id: "profile-picture", label: "Profile Picture" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [donationsError, setDonationsError] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get("/api/donations/mine").then((response) => {
      const list = response.data?.data;
      if (active && Array.isArray(list)) setDonations(list);
    }).catch((error) => {
      if (active) setDonationsError(error.response?.data?.message || "Donation history is unavailable right now.");
    }).finally(() => { if (active) setDonationsLoading(false); });
    getPublicEvents().then((response) => {
      const list = response.data?.data;
      if (active && Array.isArray(list)) setEvents(list);
    }).catch(() => { if (active) setEventsError("Events could not be loaded right now."); }).finally(() => { if (active) setEventsLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "Member";
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const completedDonations = donations.filter((item) => ["success", "successful", "completed", "verified"].includes(String(item.status || "").toLowerCase()));
  const donationCurrencies = new Set(completedDonations.map((item) => String(item.currency || "NGN").toUpperCase()));
  const totalGiven = donationCurrencies.size === 1
    ? formatCurrency(completedDonations.reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [...donationCurrencies][0])
    : donationCurrencies.size > 1 ? "Multiple" : formatCurrency(0, "NGN");
  const upcomingEvents = useMemo(() => events.filter((event) => {
    const date = new Date(event.date);
    return !Number.isNaN(date.getTime()) && date >= new Date(new Date().setHours(0, 0, 0, 0));
  }).sort((a, b) => new Date(a.date) - new Date(b.date)), [events]);

  const goToSection = (section) => {
    setMobileOpen(false);
    if (section === "events") { navigate("/events"); return; }
    if (section === "prayer") { navigate("/contact#prayerForm"); return; }
    if (section === "settings") { setActiveTab("edit-profile"); return; }
    if (section === "overview") { setActiveTab("overview"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setActiveTab("overview");
    window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  const logout = () => { logoutUser(); navigate("/login"); };
  const filteredDonations = donations.filter((item) => `${item.paymentReference || ""} ${item.donationType || ""} ${item.campaign?.title || ""}`.toLowerCase().includes(search.toLowerCase()));
  const filteredEvents = upcomingEvents.filter((event) => `${event.title || ""} ${event.location || ""}`.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: "Total given", value: totalGiven, note: `${completedDonations.length} confirmed donation${completedDonations.length === 1 ? "" : "s"}`, icon: Heart, color: "gold" },
    { label: "Upcoming events", value: String(upcomingEvents.length), note: upcomingEvents[0] ? `Next: ${new Date(upcomingEvents[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : "No events scheduled", icon: CalendarDays, color: "blue" },
    { label: "Notifications", value: "—", note: "Personal notifications are not available yet", icon: Bell, color: "purple" },
    { label: "Account", value: user?.role === "admin" ? "Admin" : "Member", note: "Your account is active", icon: UserRound, color: "gold" },
  ];

  return (
    <div className="member-dashboard">
      <Sidebar onNavigate={goToSection} onLogout={logout} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && <button className="member-sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="member-main">
        <header className="member-header">
          <button className="member-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open dashboard navigation"><Menu size={21} /></button>
          <div className="member-heading">
            <span className="member-eyebrow">Member dashboard</span>
            <h1>Welcome back, {displayName.split(" ")[0]}</h1>
          </div>
          <div className="member-header-actions">
            <label className="member-search"><Search size={18} aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" aria-label="Search dashboard" /><SlidersHorizontal size={16} aria-hidden="true" /></label>
            <button className="member-icon-button" type="button" onClick={() => goToSection("notifications")} aria-label="View notifications"><Bell size={19} /></button>
            <button className="member-account-chip" type="button" onClick={() => setActiveTab("edit-profile")} aria-label="Edit your profile"><span className="member-avatar">{initials}</span><span>{user?.firstName || displayName.split(" ")[0]}</span></button>
          </div>
        </header>

        <div className="member-content">
          <nav className="member-tabs" aria-label="Dashboard sections" role="tablist">
            {tabs.map((tab) => <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} className={activeTab === tab.id ? "is-active" : ""} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
          </nav>

          {activeTab === "overview" ? <>
            <section className="member-stat-grid" aria-label="Account overview">
              {stats.map(({ label, value, note, icon: Icon, color }) => <article className="member-stat-card" key={label}><div className="member-stat-top"><span>{label}</span><span className={`member-stat-icon ${color}`}><Icon size={19} /></span></div><strong>{value}</strong><small>{note}</small></article>)}
            </section>

            <div className="member-dashboard-grid">
              <div className="member-primary-column">
                <div id="donations"><DonationHistory donations={filteredDonations} loading={donationsLoading} error={donationsError} search={search} /></div>
                <div id="activities"><ActivityTimeline donations={completedDonations} /></div>
              </div>
              <aside className="member-secondary-column">
                <div id="events"><CalendarCard events={filteredEvents} loading={eventsLoading} error={eventsError} /></div>
                <div id="notifications"><NotificationPanel events={upcomingEvents.slice(0, 2)} donationsCount={completedDonations.length} /></div>
              </aside>
            </div>
          </> : <section className="member-form-panel">
            {activeTab === "edit-profile" && <DashboardEditProfile />}
            {activeTab === "change-password" && <DashboardChangePassword />}
            {activeTab === "profile-picture" && <DashboardUploadPicture />}
          </section>}
        </div>
      </main>
    </div>
  );
}
