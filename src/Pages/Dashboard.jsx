import { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import Navbar from "../Components/Dashboard/Navbar";
import StarsCard from "../Components/Dashboard/Stars";
import DonationChart from "../Components/Dashboard/DonationChart";
import RecentDonationTable from "../Components/Dashboard/RecentDonationTable";
import ActivityTimeline from "../Components/Dashboard/ActivityTimeline";
import NotificationPanel from "../Components/Dashboard/NotificationPanel";
import CalendarCard from "../Components/Cards/CalendarCard";
import DashboardEditProfile from "../Components/Dashboard/DashboardEditProfile";
import DashboardChangePassword from "../Components/Dashboard/DashboardChangePassword";
import DashboardUploadPicture from "../Components/Dashboard/DashboardUploadPicture";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "edit-profile", label: "Edit Profile" },
  { id: "change-password", label: "Change Password" },
  { id: "profile-picture", label: "Profile Picture" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1">
        <Navbar />

        <div className="p-8 space-y-8">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <nav className="flex gap-1 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <>
              <StarsCard />

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <DonationChart />
                </div>

                <CalendarCard />
              </div>

              <RecentDonationTable />

              <div className="grid lg:grid-cols-2 gap-8">
                <ActivityTimeline />
                <NotificationPanel />
              </div>
            </>
          )}

          {activeTab === "edit-profile" && <DashboardEditProfile />}

          {activeTab === "change-password" && <DashboardChangePassword />}

          {activeTab === "profile-picture" && <DashboardUploadPicture />}
        </div>
      </main>
    </div>
  );
}
