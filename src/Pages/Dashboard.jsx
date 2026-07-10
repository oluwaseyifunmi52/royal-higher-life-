import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import StarsCard from "../components/dashboard/Stars";
import DonationChart from "../components/dashboard/DonationChart";
import RecentDonationTable from "../components/dashboard/RecentDonationTable";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import CalendarCard from "../components/dashboard/CalendarCard";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />

            <main className="flex-1">
                <Navbar />

                <div className="p-8 space-y-8">
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
                </div>
            </main>
        </div>
    );
}