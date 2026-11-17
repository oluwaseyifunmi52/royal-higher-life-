import { useState, useEffect } from "react";
import AdminSidebar from "../Components/Admin/AdminSidebar";
import AdminNavbar from "../Components/Admin/AdminNavbar";
import DashboardStats from "../Components/Admin/DashboardStats";
import MembersTable from "../Components/Admin/MembersTable";
import DonationManager from "../Components/Admin/DonationManager";
import EventsTable from "../Components/Admin/EventsTable";
import MessagesPanel from "../Components/Admin/MessagesPanel";
import AdminSermonForm from "../Components/Admin/AdminSermonForm";
import AdminEventForm from "../Components/Admin/AdminEventForm";
import AdminMinistryForm from "../Components/Admin/AdminMinistryForm";
import AdminGalleryForm from "../Components/Admin/AdminGalleryForm";
import AdminAnnouncementForm from "../Components/Admin/AdminAnnouncementForm";
import AdminTestimonyForm from "../Components/Admin/AdminTestimonyForm";
import AdminPrayerRequestForm from "../Components/Admin/AdminPrayerRequestForm";
import AdminContactMessageForm from "../Components/Admin/AdminContactMessageForm";
import AdminLeadershipForm from "../Components/Admin/AdminLeadershipForm";
import {
  getSermons,
  deleteSermon,
  getAdminEvents,
  deleteEvent,
  getMinistries,
  deleteMinistry,
  getGalleryImages,
  deleteGalleryImage,
  getAnnouncements,
  deleteAnnouncement,
  getTestimonies,
  deleteTestimony,
  getPrayerRequests,
  deletePrayerRequest,
  getContactMessages,
  deleteContactMessage,
  getLeadership,
  deleteLeadership,
} from "../services/adminService";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "donations", label: "Donations & Campaigns" },
  { id: "sermons", label: "Sermons" },
  { id: "events", label: "Events" },
  { id: "ministries", label: "Ministries" },
  { id: "gallery", label: "Gallery" },
  { id: "announcements", label: "Announcements" },
  { id: "testimonies", label: "Testimonies" },
  { id: "prayer-requests", label: "Prayer Requests" },
  { id: "contact-messages", label: "Contact Messages" },
  { id: "leadership", label: "Leadership" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [prayerCategoryFilter, setPrayerCategoryFilter] = useState("all");
  const [contactSubjectFilter, setContactSubjectFilter] = useState("all");
  const [leadership, setLeadership] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openForm, setOpenForm] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "dashboard") return;

    const fetchData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case "sermons":
            setSermons((await getSermons()).data.data);
            break;
          case "events":
            setEvents((await getAdminEvents()).data.data);
            break;
          case "ministries":
            setMinistries((await getMinistries()).data.data);
            break;
          case "gallery":
            setGalleryImages((await getGalleryImages()).data.data);
            break;
          case "announcements":
            setAnnouncements((await getAnnouncements()).data.data);
            break;
          case "testimonies":
            setTestimonies((await getTestimonies()).data.data);
            break;
          case "prayer-requests":
            setPrayerRequests((await getPrayerRequests()).data.data);
            break;
          case "contact-messages":
            setContactMessages((await getContactMessages()).data.data);
            break;
          case "leadership":
            setLeadership((await getLeadership()).data.data);
            break;
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      switch (type) {
        case "sermon":
          await deleteSermon(id);
          setSermons((prev) => prev.filter((s) => s._id !== id));
          break;
        case "event":
          await deleteEvent(id);
          setEvents((prev) => prev.filter((e) => e._id !== id));
          break;
        case "ministry":
          await deleteMinistry(id);
          setMinistries((prev) => prev.filter((m) => m._id !== id));
          break;
        case "gallery":
          await deleteGalleryImage(id);
          setGalleryImages((prev) => prev.filter((g) => g._id !== id));
          break;
        case "announcement":
          await deleteAnnouncement(id);
          setAnnouncements((prev) => prev.filter((a) => a._id !== id));
          break;
        case "testimony":
          await deleteTestimony(id);
          setTestimonies((prev) => prev.filter((t) => t._id !== id));
          break;
        case "prayer-request":
          await deletePrayerRequest(id);
          setPrayerRequests((prev) => prev.filter((p) => p._id !== id));
          break;
        case "contact-message":
          await deleteContactMessage(id);
          setContactMessages((prev) => prev.filter((c) => c._id !== id));
          break;
        case "leadership":
          await deleteLeadership(id);
          setLeadership((prev) => prev.filter((l) => l._id !== id));
          break;
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openCreateForm = (type) => {
    setEditItem(null);
    setOpenForm(type);
  };

  const openEditForm = (type, item) => {
    setEditItem(item);
    setOpenForm(type);
  };

  const closeForm = () => {
    setOpenForm(null);
    setEditItem(null);
  };

  const handleFormSaved = async () => {
    closeForm();
    setLoading(true);
    try {
      switch (activeTab) {
        case "sermons":
          setSermons((await getSermons()).data.data);
          break;
        case "events":
          setEvents((await getAdminEvents()).data.data);
          break;
        case "ministries":
          setMinistries((await getMinistries()).data.data);
          break;
        case "gallery":
          setGalleryImages((await getGalleryImages()).data.data);
          break;
        case "announcements":
          setAnnouncements((await getAnnouncements()).data.data);
          break;
        case "testimonies":
          setTestimonies((await getTestimonies()).data.data);
          break;
        case "prayer-requests":
          setPrayerRequests((await getPrayerRequests()).data.data);
          break;
        case "contact-messages":
          setContactMessages((await getContactMessages()).data.data);
          break;
        case "leadership":
          setLeadership((await getLeadership()).data.data);
          break;
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderFormModal = () => {
    if (!openForm) return null;

    const formMap = {
      sermons: <AdminSermonForm sermon={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      events: <AdminEventForm event={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      ministries: <AdminMinistryForm ministry={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      gallery: <AdminGalleryForm image={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      announcements: <AdminAnnouncementForm announcement={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      testimonies: <AdminTestimonyForm testimony={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      "prayer-requests": <AdminPrayerRequestForm prayerRequest={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      "contact-messages": <AdminContactMessageForm contactMessage={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
      leadership: <AdminLeadershipForm leadership={editItem} onClose={closeForm} onSaved={handleFormSaved} />,
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {formMap[openForm]}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <DashboardStats />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MembersTable />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <EventsTable />
      </div>
      <MessagesPanel />
    </div>
  );

  const renderListTab = (title, type, data, columns, canCreate = true) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {canCreate && <button
          onClick={() => openCreateForm(type)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add New
        </button>}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow text-slate-400">
          No {title.toLowerCase()} found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="admin-table-container">
            <table className="w-full admin-table">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right text-sm space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditForm(type, item)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type.replace("-", " "), item._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const sermonColumns = [
    { key: "title", label: "Title" },
    { key: "preacher", label: "Preacher" },
    { key: "sermonDate", label: "Date", render: (val) => val ? new Date(val).toLocaleDateString() : "—" },
    {
      key: "category",
      label: "Category",
      render: (val) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{val}</span>
      ),
    },
  ];

  const eventColumns = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "location", label: "Location" },
    {
      key: "isFeatured",
      label: "Featured",
      render: (val) => val ? "Yes" : "No",
    },
  ];

  const ministryColumns = [
    { key: "name", label: "Name" },
    { key: "leader", label: "Leader" },
    {
      key: "description",
      label: "Description",
      render: (val) => <span className="truncate max-w-xs block">{val}</span>,
    },
  ];

  const galleryColumns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    {
      key: "imageUrl",
      label: "Image",
      render: (val) => (
        <img src={val} alt="" className="h-10 w-10 rounded object-cover" />
      ),
    },
  ];

  const announcementColumns = [
    { key: "title", label: "Title" },
    {
      key: "content",
      label: "Content",
      render: (val) => <span className="truncate max-w-xs block">{val}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const testimonyColumns = [
    { key: "reference", label: "Reference" },
    { key: "name", label: "Name" },
    { key: "message", label: "Testimony", render: (val) => <span className="block max-w-xs truncate">{val}</span> },
    { key: "rating", label: "Rating", render: (val) => `${val || "—"}/5` },
    { key: "createdAt", label: "Submitted", render: (val) => val ? new Date(val).toLocaleDateString() : "—" },
    {
      key: "status",
      label: "Status",
      render: (val, item) => item.isApproved ? "Approved" : val || "Pending review",
    },
  ];

  const prayerRequestColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "reference", label: "Reference" },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (val, item) => val || (item.isAnswered ? "completed" : "pending"),
    },
    { key: "createdAt", label: "Submitted", render: (val) => val ? new Date(val).toLocaleDateString() : "—" },
  ];

  const contactMessageColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "reference", label: "Reference" },
    { key: "subject", label: "Subject" },
    { key: "notificationStatus", label: "Ministry Email", render: (val, item) => `${val || "unknown"}${item.notificationDeliveryStatus === "delivered" ? " · delivered" : " · delivery unconfirmed"}` },
    { key: "createdAt", label: "Submitted", render: (val) => val ? new Date(val).toLocaleDateString() : "—" },
    {
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === "read" ? "bg-blue-100 text-blue-700" : val === "replied" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {val || "unread"}
        </span>
      ),
    },
  ];

  const leadershipColumns = [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "isPastor", label: "Senior Pastor", render: (val) => val ? "Yes" : "No" },
  ];

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1">
        <AdminNavbar sidebarOpen={sidebarOpen} onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="p-4 md:p-8">
          <div className="flex gap-1 mb-8 border-b border-slate-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "donations" && <DonationManager />}
          {activeTab === "sermons" && renderListTab("Sermons", "sermons", sermons, sermonColumns)}
          {activeTab === "events" && renderListTab("Events", "events", events, eventColumns)}
          {activeTab === "ministries" && renderListTab("Ministries", "ministries", ministries, ministryColumns)}
          {activeTab === "gallery" && renderListTab("Gallery", "gallery", galleryImages, galleryColumns)}
          {activeTab === "announcements" && renderListTab("Announcements", "announcements", announcements, announcementColumns)}
          {activeTab === "testimonies" && renderListTab("Testimonies", "testimonies", testimonies, testimonyColumns, false)}
          {activeTab === "prayer-requests" && (
            <>
              <label className="mb-4 flex max-w-sm flex-col gap-2 text-sm font-medium text-slate-700">
                Filter by category
                <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={prayerCategoryFilter} onChange={(event) => setPrayerCategoryFilter(event.target.value)}>
                  <option value="all">All categories</option>
                  {["Healing", "Financial Breakthrough", "Family", "Spiritual Growth", "General Prayer"].map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              {renderListTab("Prayer Requests", "prayer-request", prayerCategoryFilter === "all" ? prayerRequests : prayerRequests.filter((request) => request.category === prayerCategoryFilter), prayerRequestColumns, false)}
            </>
          )}
          {activeTab === "contact-messages" && (
            <>
              <label className="mb-4 flex max-w-sm flex-col gap-2 text-sm font-medium text-slate-700">
                Filter by subject
                <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={contactSubjectFilter} onChange={(event) => setContactSubjectFilter(event.target.value)}>
                  <option value="all">All subjects</option>
                  {["Prayer Request", "Volunteer Inquiry", "Donation Inquiry", "General Question"].map((subject) => <option key={subject}>{subject}</option>)}
                </select>
              </label>
              {renderListTab("Contact Messages", "contact-message", contactSubjectFilter === "all" ? contactMessages : contactMessages.filter((message) => message.subject === contactSubjectFilter), contactMessageColumns, false)}
            </>
          )}
          {activeTab === "leadership" && renderListTab("Leadership", "leadership", leadership, leadershipColumns)}
        </div>

        {renderFormModal()}
      </div>
    </div>
  );
}
