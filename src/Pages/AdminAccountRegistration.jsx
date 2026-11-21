import { Link } from "react-router-dom";
import AdminUsersManager from "../Components/Admin/AdminUsersManager";

export default function AdminAccountRegistration() {
  return <main className="min-h-screen bg-slate-900 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <Link className="mb-5 inline-flex text-amber-400 hover:text-amber-300" to="/admin/dashboard">← Back to Admin Dashboard</Link>
      <AdminUsersManager />
    </div>
  </main>;
}
