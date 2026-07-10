import Sidebar from "../Components/Dashboard/Sidebar";
import Navbar from "../Components/Dashboard/Navbar";
import StarsCard from "../Components/Dashboard/Stars";
import DonationChart from "../Components/Dashboard/DonationChart";
import RecentDonationTable from "../Components/Dashboard/RecentDonationTable";
import ActivityTimeline from "../Components/Dashboard/ActivityTimeline";
import NotificationPanel from "../Components/Dashboard/NotificationPanel";
import CalendarCard from "../Components/Cards/CalendarCard";


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