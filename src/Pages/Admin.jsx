import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import DashboardStats from "../components/admin/DashboardStats";
import RevenueChart from "../components/admin/RevenueChart";
import DonationChart from "../components/admin/DonationChart";
import MembersTable from "../components/admin/MembersTable";
import RecentPayments from "../components/admin/RecentPayments";
import TopDonors from "../components/admin/TopDonors";
import LatestActivities from "../components/admin/LatestActivities";
import MessagesPanel from "../components/admin/MessagesPanel";

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

                        <LatestActivities />

                    </div>

                    <MessagesPanel />

                </div>

            </div>

        </div>
    );
}