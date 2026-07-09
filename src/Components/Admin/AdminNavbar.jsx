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
} from "lucide-react";

export default function AdminNavbar() {
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
            className="bg-white shadow-md border-b sticky top-0 z-50"
        >
            <div className="flex items-center justify-between px-8 py-4">

                {/* Left */}

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <div className="flex items-center gap-2 text-gray-500 mt-1">

                        <CalendarDays size={16} />

                        <span>{today}</span>

                    </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-5">

                    {/* Search */}

                    <div className="relative hidden md:block">

                        <Search
                            className="absolute left-4 top-3 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search members..."
                            className="w-72 rounded-xl border bg-gray-50 pl-11 pr-4 py-2 outline-none focus:ring-2 focus:ring-green-600"
                        />

                    </div>

                    {/* Dark Mode */}

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                    >
                        {darkMode ? (
                            <Sun className="text-yellow-500" size={20} />
                        ) : (
                            <Moon className="text-gray-700" size={20} />
                        )}
                    </button>

                    {/* Messages */}

                    <button className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">

                        <Mail size={20} />

                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            4
                        </span>

                    </button>

                    {/* Notifications */}

                    <button className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">

                        <Bell size={20} />

                        <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            7
                        </span>

                    </button>

                    {/* Profile */}

                    <div className="relative">

                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
                        >

                            <img
                                src="https://i.pravatar.cc/150?img=32"
                                alt="Admin"
                                className="w-11 h-11 rounded-full border-2 border-green-700"
                            />

                            <div className="hidden lg:block text-left">

                                <h4 className="font-semibold text-gray-800">
                                    Admin User
                                </h4>

                                <p className="text-sm text-gray-500">
                                    Super Admin
                                </p>

                            </div>

                            <ChevronDown size={18} />

                        </button>

                        {openMenu && (

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-2xl border overflow-hidden"
                            >

                                <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50">

                                    <User size={18} />

                                    My Profile

                                </button>

                                <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50">

                                    <Settings size={18} />

                                    Settings

                                </button>

                                <hr />

                                <button className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50">

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