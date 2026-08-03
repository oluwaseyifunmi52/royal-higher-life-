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

export default function Admin() {
    return (
        <div className="flex bg-slate-100 min-h-screen">

            <AdminSidebar />

            <div className="flex-1">

                <AdminNavbar />

                <div className="p-8 space-y-8">

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

            </div>

        </div>
    );
}