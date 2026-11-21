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
    X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar({ isOpen, onClose, activeTab, onSelectTab }) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/admin",
            tabId: "dashboard",
        },
        {
            title: "Members",
            icon: Users,
            path: "/admin/members",
        },
        {
            title: "Donations",
            icon: HeartHandshake,
            path: "/admin",
            tabId: "donations",
        },
        {
            title: "Payments",
            icon: CreditCard,
            path: "/admin/payments",
        },
        {
            title: "Prayer Requests",
            icon: HandHeart,
            path: "/admin",
            tabId: "prayer-requests",
        },
        {
            title: "Events",
            icon: CalendarDays,
            path: "/admin",
            tabId: "events",
        },
        {
            title: "Sermons",
            icon: BookOpen,
            path: "/admin",
            tabId: "sermons",
        },
        {
            title: "Gallery",
            icon: Image,
            path: "/admin",
            tabId: "gallery",
        },
        {
            title: "Announcements",
            icon: Bell,
            path: "/admin/announcements",
        },
        {
            title: "Website Content",
            icon: Settings,
            path: "/admin/content",
        },
        {
            title: "Administrator Access",
            icon: Users,
            path: "/admin/users",
            superAdminOnly: true,
        },
        {
            title: "Ministries",
            icon: Building2,
            path: "/admin",
            tabId: "ministries",
        },
        {
            title: "Contact Messages",
            icon: Mail,
            path: "/admin",
            tabId: "contact-messages",
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

    // Close sidebar on route change (mobile)
    useEffect(() => {
        if (isOpen && window.innerWidth < 1024) {
            onClose();
        }
    }, [isOpen, onClose]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Trap focus within sidebar when open on mobile
    useEffect(() => {
        if (!isOpen || window.innerWidth >= 1024) return;

        const sidebar = document.querySelector('.admin-sidebar');
        if (!sidebar) return;

        const focusableElements = sidebar.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener('keydown', handleTab);
        return () => document.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    return (
        <motion.aside
            className={`admin-sidebar min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white shadow-2xl flex flex-col ${isOpen ? 'open' : ''}`}
            animate={{
                x: isOpen ? 0 : (window.innerWidth < 1024 ? '100%' : 0),
            }}
            transition={{
                duration: 0.3,
                type: "spring",
                damping: 25,
                stiffness: 200,
            }}
            role="navigation"
            aria-label="Admin sidebar"
        >
            {/* Logo */}
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 p-2 rounded-xl">
                        <Church className="text-slate-900" size={28} />
                    </div>
                    {!collapsed && (
                        <div>
                            <h2 className="font-bold text-lg">
                                Royal Higher Life
                            </h2>
                            <p className="text-slate-300 text-xs">
                                Admin Panel
                            </p>
                        </div>
                    )}
                </div>

                {/* Collapse button (desktop) / Close button (mobile) */}
                <button
                    onClick={() => {
                        if (window.innerWidth < 1024) {
                            onClose();
                        } else {
                            setCollapsed(!collapsed);
                        }
                    }}
                    className="hover:bg-slate-700 p-2 rounded-lg transition"
                    aria-label={window.innerWidth < 1024 ? "Close sidebar" : (collapsed ? "Expand sidebar" : "Collapse sidebar")}
                >
                    {window.innerWidth < 1024 ? (
                        <X size={20} />
                    ) : collapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                {menuItems.filter((item) => {
                    if (item.superAdminOnly) return user?.role === "superAdmin";
                    const role = user?.role;
                    if (["admin", "superAdmin"].includes(role)) return true;
                    const rawPath = item.path.replace(/^\/admin\/?/, "").split("/")[0] || "dashboard";
                    const path = ["prayers", "messages", "volunteers", "partnerships", "event-registrations"].includes(rawPath) ? "submissions" : rawPath;
                    const rolePaths = {
                        contentAdmin: ["dashboard", "content", "settings", "gallery", "sermons", "events", "announcements", "testimonies", "ministries"],
                        mediaAdmin: ["dashboard", "media", "gallery"],
                        ministryAdmin: ["dashboard", "events", "ministries", "submissions"],
                    };
                    return (rolePaths[role] || []).includes(path);
                }).map((item) => {
                    const Icon = item.icon;
                    const isActiveTab = item.tabId ? activeTab === item.tabId : false;
                    return (
                        <NavLink
                            key={item.title}
                            to={item.tabId ? "/admin" : item.path}
                            onClick={() => {
                                if (item.tabId && typeof onSelectTab === "function") {
                                    onSelectTab(item.tabId);
                                }
                                if (window.innerWidth < 1024) {
                                    onClose();
                                }
                            }}
                            className={({ isActive }) => {
                                const active = item.tabId ? isActiveTab : isActive;
                                return `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${active
                                    ? "bg-yellow-400 text-slate-900 font-semibold shadow-lg"
                                    : "hover:bg-slate-700"}`;
                            }}
                        >
                            <Icon size={22} aria-hidden="true" />
                            {!collapsed && window.innerWidth >= 1024 && (
                                <span>{item.title}</span>
                            )}
                        </NavLink>
                    );
                })}

                {/* Mobile-only bottom navigation when collapsed on desktop */}
                {collapsed && window.innerWidth >= 1024 && (
                    <div className="px-3 pb-4">
                        <NavLink
                            to="/admin"
                            className="flex items-center justify-center p-3 rounded-xl hover:bg-slate-700 transition"
                            title="Dashboard"
                        >
                            <LayoutDashboard size={24} />
                        </NavLink>
                    </div>
                )}
            </div>

            {/* Admin Info */}
            <div className="border-t border-slate-700 p-5">
                <div className="flex items-center gap-3">
                    <img
                        src={user?.profileImage || "https://ui-avatars.com/api/?name=Admin&background=0b1220&color=ffd46b"}
                        alt={user ? `${user.firstName} ${user.lastName}` : "Administrator"}
                        className="w-12 h-12 rounded-full border-2 border-yellow-400"
                    />
                    {!collapsed && (
                        <div>
                            <h4 className="font-semibold">
                            {user ? `${user.firstName} ${user.lastName}` : "Administrator"}
                            </h4>
                            <p className="text-slate-300 text-sm">
                            {user?.email || ""}
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => { logoutUser(); sessionStorage.removeItem("adminRole"); onClose(); navigate("/admin/login", { replace: true }); }}
                    className="mt-5 w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-3 rounded-xl transition"
                >
                    <LogOut size={18} />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </motion.aside>
    );
}
