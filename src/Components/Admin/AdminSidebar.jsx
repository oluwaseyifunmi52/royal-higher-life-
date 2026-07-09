import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    HeartHandshake,
    CreditCard,
    CalendarDays,
    BookOpen,
    Image,
    Building2,
    HandHeart,
    Mail,
    BarChart3,
    Settings,
    LogOut,
    Church,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin",
        },
        {
            title: "Members",
            icon: Users,
            path: "/admin/members",
        },
        {
            title: "Donations",
            icon: HeartHandshake,
            path: "/admin/donations",
        },
        {
            title: "Payments",
            icon: CreditCard,
            path: "/admin/payments",
        },
        {
            title: "Prayer Requests",
            icon: HandHeart,
            path: "/admin/prayers",
        },
        {
            title: "Events",
            icon: CalendarDays,
            path: "/admin/events",
        },
        {
            title: "Sermons",
            icon: BookOpen,
            path: "/admin/sermons",
        },
        {
            title: "Gallery",
            icon: Image,
            path: "/admin/gallery",
        },
        {
            title: "Ministries",
            icon: Building2,
            path: "/admin/ministries",
        },
        {
            title: "Messages",
            icon: Mail,
            path: "/admin/messages",
        },
        {
            title: "Reports",
            icon: BarChart3,
            path: "/admin/reports",
        },
        {
            title: "Settings",
            icon: Settings,
            path: "/admin/settings",
        },
    ];

    return (
        <motion.aside
            animate={{
                width: collapsed ? 90 : 270,
            }}
            transition={{
                duration: 0.3,
            }}
            className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-950 text-white shadow-2xl flex flex-col"
        >
            {/* Logo */}

            <div className="p-6 border-b border-green-700 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="bg-yellow-400 p-2 rounded-xl">

                        <Church className="text-green-900" size={28} />

                    </div>

                    {!collapsed && (
                        <div>
                            <h2 className="font-bold text-lg">
                                Royal Higher Life
                            </h2>

                            <p className="text-green-200 text-xs">
                                Admin Panel
                            </p>
                        </div>
                    )}

                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hover:bg-green-700 p-2 rounded-lg transition"
                >
                    {collapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                </button>

            </div>

            {/* Navigation */}

            <div className="flex-1 px-3 py-6 space-y-2">

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? "bg-yellow-400 text-green-900 font-semibold shadow-lg"
                                    : "hover:bg-green-700"
                                }`
                            }
                        >
                            <Icon size={22} />

                            {!collapsed && (
                                <span>{item.title}</span>
                            )}
                        </NavLink>
                    );
                })}

            </div>

            {/* Admin Info */}

            <div className="border-t border-green-700 p-5">

                <div className="flex items-center gap-3">

                    <img
                        src="https://i.pravatar.cc/150?img=12"
                        alt="Admin"
                        className="w-12 h-12 rounded-full border-2 border-yellow-400"
                    />

                    {!collapsed && (
                        <div>

                            <h4 className="font-semibold">
                                Admin User
                            </h4>

                            <p className="text-green-200 text-sm">
                                administrator@royal.org
                            </p>

                        </div>
                    )}

                </div>

                <button className="mt-5 w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-3 rounded-xl transition">

                    <LogOut size={18} />

                    {!collapsed && "Logout"}

                </button>

            </div>

        </motion.aside>
    );
}