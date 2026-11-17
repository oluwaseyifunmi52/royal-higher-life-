import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Settings, ChevronDown, Bell, Moon, Sun, LayoutDashboard } from "lucide-react";
import logo from "../assets/royal logo.jpeg";

const getUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

export default function Header() {
    const navigate = useNavigate();
    const user = getUser();
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 8);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && profileOpen) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [profileOpen]);

    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
    }, [darkMode]);

    return (
        <header className={`top-bar sticky top-0 z-[var(--z-sticky)] transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md border-b border-navy-100' : 'bg-white border-b border-navy-100'}`} role="banner">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 lg:h-18">
                    {/* Logo - only shown on mobile when sidebar is collapsed */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 text-navy-900 font-display font-bold text-xl hover:opacity-80 transition-opacity" aria-label="Royal HigherLife Christian Ministries - Home">
                        <span className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white font-display font-bold text-lg">
                            RH
                        </span>
                        <span>Royal HigherLife</span>
                    </Link>

                    {/* Desktop spacer */}
                    <div className="hidden lg:flex-1" />

                    {/* Right side actions */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* Dark mode toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 md:p-3 rounded-xl bg-navy-50 hover:bg-navy-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? (
                                <Sun size={20} className="text-gold-600" />
                            ) : (
                                <Moon size={20} className="text-navy-600" />
                            )}
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 md:p-3 rounded-xl bg-navy-50 hover:bg-navy-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400" aria-label="Notifications">
                            <Bell size={20} className="text-navy-600" />
                            <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white w-4 h-4 md:w-5 md:h-5 rounded-full text-xs flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {/* User Profile */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 md:gap-3 hover:bg-navy-50 px-2 md:px-3 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                                    aria-label="User menu"
                                    aria-expanded={profileOpen}
                                    aria-haspopup="true"
                                >
                                    <img
                                        src="https://i.pravatar.cc/150?img=32"
                                        alt="User"
                                        className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-gold-400"
                                    />
                                    <div className="hidden md:block text-left">
                                        <p className="font-semibold text-navy-900 text-sm">{user.firstName || 'User'}</p>
                                        <p className="text-xs text-navy-500">{user.role === 'admin' ? 'Administrator' : 'Member'}</p>
                                    </div>
                                    <ChevronDown size={16} className={profileOpen ? 'rotate-180' : ''} />
                                </button>

                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-2 w-48 md:w-56 rounded-2xl bg-white shadow-2xl border border-navy-100 overflow-hidden z-50"
                                    >
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-navy-50 text-sm text-navy-700"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <LayoutDashboard size={18} />
                                            My Dashboard
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-navy-50 text-sm text-navy-700"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <Settings size={18} />
                                                Administration
                                            </Link>
                                        )}
                                        <hr className="my-1 border-navy-100" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 lg:px-6 lg:py-3 bg-navy-900 text-white font-semibold text-body-sm lg:text-body rounded-xl hover:bg-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            </header>
        );
    }