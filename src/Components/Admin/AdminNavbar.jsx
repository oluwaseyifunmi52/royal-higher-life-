import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Bell,
    Mail,
    Moon,
    Sun,
    ChevronDown,
    User,
    Settings,
    LogOut,
    CalendarDays,
    Menu,
    X,
} from "lucide-react";

export default function AdminNavbar({ sidebarOpen, onSidebarToggle }) {
    const [darkMode, setDarkMode] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-50 shadow-md border-b sticky top-0 z-40"
        >
            <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">

                {/* Left - Sidebar Toggle + Title */}
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onSidebarToggle}
                        className="admin-sidebar-toggle md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700"
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        aria-expanded={sidebarOpen}
                    >
                        {sidebarOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                    <div className="hidden sm:block">
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                            <CalendarDays size={14} />
                            <span className="text-sm">{today}</span>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 md:gap-4">

                    {/* Search */}
                    <div className="relative hidden lg:block">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 md:w-72 rounded-xl border bg-white pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
                        />
                    </div>

                    {/* Dark Mode */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 md:p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? (
                            <Sun className="text-yellow-500" size={20} />
                        ) : (
                            <Moon className="text-slate-700" size={20} />
                        )}
                    </button>

                    {/* Messages */}
                    <button className="relative p-2 md:p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition" aria-label="Messages">
                        <Mail size={20} />
                        <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white w-4 h-4 md:w-5 md:h-5 rounded-full text-xs flex items-center justify-center">
                            4
                        </span>
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 md:p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition" aria-label="Notifications">
                        <Bell size={20} />
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white w-4 h-4 md:w-5 md:h-5 rounded-full text-xs flex items-center justify-center">
                            7
                        </span>
                    </button>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className="flex items-center gap-2 md:gap-3 hover:bg-slate-100 px-2 md:px-3 py-2 rounded-xl transition"
                            aria-label="User menu"
                            aria-expanded={openMenu}
                            aria-haspopup="true"
                        >
                            <img
                                src="https://i.pravatar.cc/150?img=32"
                                alt="Admin"
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-green-700"
                            />
                            <div className="hidden md:block text-left">
                                <h4 className="font-semibold text-slate-800 text-sm">
                                    Admin User
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Super Admin
                                </p>
                            </div>
                            <ChevronDown size={16} className={openMenu ? "rotate-180" : ""} />
                        </button>

                        {openMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-48 md:w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50"
                            >
                                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                                    <User size={18} />
                                    My Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm text-slate-700">
                                    <Settings size={18} />
                                    Settings
                                </button>
                                <hr className="my-1 border-slate-200" />
                                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm">
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    );
}