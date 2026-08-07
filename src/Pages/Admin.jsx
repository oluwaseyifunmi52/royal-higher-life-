import { useState, useEffect } from "react";
import AdminSidebar from "../Components/Admin/AdminSidebar";
import AdminNavbar from "../Components/Admin/AdminNavbar";
import DashboardStats from "../Components/Admin/DashboardStats";
import RevenueChart from "../Components/Admin/RevenueChart";
import DonationChart from "../Components/Admin/DonationChart";
import MembersTable from "../Components/Admin/MembersTable";
import RecentPayments from "../Components/Admin/RecentPayments";
import TopDonors from "../Components/Admin/TopDonors";
import EventsTable from "../Components/Admin/EventsTable";
import MessagesPanel from "../Components/Admin/MessagesPanel";
import AdminSermonForm from "../Components/Admin/AdminSermonForm";
import AdminEventForm from "../Components/Admin/AdminEventForm";
import AdminMinistryForm from "../Components/Admin/AdminMinistryForm";
import AdminGalleryForm from "../Components/Admin/AdminGalleryForm";
import AdminAnnouncementForm from "../Components/Admin/AdminAnnouncementForm";
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
} from "../services/adminService";

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "sermons", label: "Sermons" },
  { id: "events", label: "Events" },
  { id: "ministries", label: "Ministries" },
  { id: "gallery", label: "Gallery" },
  { id: "announcements", label: "Announcements" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(null);
  const [editItem, setEditItem] = useState(null);

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
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {formMap[openForm]}
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <DashboardStats />
      <div className="grid lg:grid-cols-2 gap-8">
        <RevenueChart />
        <DonationChart />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MembersTable />
        </div>
        <TopDonors />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentPayments />
        <EventsTable />
      </div>
      <MessagesPanel />
    </div>
  );

  const renderListTab = (title, type, data, columns) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <button
          onClick={() => openCreateForm(type)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow text-slate-400">
          No {title.toLowerCase()} found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
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
                      onClick={() => handleDelete(type, item._id)}
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
      )}
    </div>
  );

  const sermonColumns = [
    { key: "title", label: "Title" },
    { key: "speaker", label: "Speaker" },
    { key: "date", label: "Date" },
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
      key: "status",
      label: "Status",
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === "upcoming" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
          {val}
        </span>
      ),
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

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminNavbar />

        <div className="p-8">
          <div className="flex gap-1 mb-8 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
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
          {activeTab === "sermons" && renderListTab("Sermons", "sermons", sermons, sermonColumns)}
          {activeTab === "events" && renderListTab("Events", "events", events, eventColumns)}
          {activeTab === "ministries" && renderListTab("Ministries", "ministries", ministries, ministryColumns)}
          {activeTab === "gallery" && renderListTab("Gallery", "gallery", galleryImages, galleryColumns)}
          {activeTab === "announcements" && renderListTab("Announcements", "announcements", announcements, announcementColumns)}
        </div>
      </div>

      {renderFormModal()}
    </div>
  );
}
