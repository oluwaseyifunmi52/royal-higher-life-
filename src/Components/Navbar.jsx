import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ministryLogo from "../assets/royal logo.jpeg";
import { useAuth } from "../context/AuthContext";

const navItems = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about" },
    { title: "Leadership", path: "/leadership" },
    { title: "Sermons", path: "/sermons" },
    { title: "Events", path: "/events" },
    { title: "Gallery", path: "/gallery" },
    { title: "Mission", path: "/mission" },
    { title: "Contact", path: "/contact" },
];

const linkClasses = ({ isActive }) =>
    `public-nav-link relative inline-flex min-h-11 items-center whitespace-nowrap px-1 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1426] xl:text-[0.9375rem] ${
        isActive
            ? "text-[#f5b335] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#f5b335]"
            : "text-white hover:text-[#ffd46b]"
    }`;

const mobileLinkClasses = ({ isActive }) =>
    `public-mobile-link flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b] ${
        isActive
            ? "bg-[#f5b335]/10 text-[#f5b335]"
            : "text-white hover:bg-white/10 hover:text-[#ffd46b]"
    }`;

export default function Navbar() {
    const { user, logoutUser, loading } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen]);

    const closeMobileMenu = () => setMobileOpen(false);

    return (
        <header className={`public-navbar sticky top-0 z-50 border-b border-[#1f2a44] text-white transition-colors duration-200 ${scrolled ? "bg-[#0d1426]/95 shadow-lg backdrop-blur-md" : "bg-[#0d1426]"}`}>
            <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 xl:px-8">
                <div className="flex min-h-16 items-center justify-between gap-3 lg:min-h-[76px]">
                    <Link
                        to="/"
                        className="flex min-w-0 shrink-0 items-center gap-2.5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b] sm:gap-3"
                        aria-label="Royal HigherLife Christian Ministries home"
                    >
                        <img
                            src={ministryLogo}
                            alt="Royal HigherLife Christian Ministries logo"
                            width="56"
                            height="56"
                            className="h-11 w-11 shrink-0 rounded-full object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                        />
                        <span className="min-w-0 text-sm font-bold leading-tight sm:text-base lg:text-xl" style={{ fontFamily: "var(--font-display)" }}>
                            <span className="block whitespace-nowrap">Royal HigherLife</span>
                            <span className="block whitespace-nowrap text-xs text-[#f5b335] sm:text-sm lg:text-base">Christian Ministries</span>
                        </span>
                    </Link>

                    <nav className="hidden flex-1 items-center justify-center xl:flex" aria-label="Main navigation">
                        <ul className="flex items-center gap-3 2xl:gap-5">
                            {navItems.map(({ title, path }) => (
                                <li key={path}>
                                    <NavLink to={path} end={path === "/"} className={linkClasses}>
                                        {title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <Link
                            to="/donate"
                            className="public-give-link hidden min-h-11 items-center justify-center rounded-full bg-[#f5b335] px-4 text-sm font-bold transition-colors hover:bg-[#ffd46b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1426] sm:inline-flex lg:px-5"
                        >
                            Give Now
                        </Link>

                        {loading ? (
                            <span className="hidden text-sm text-slate-300 xl:inline-flex" role="status">Checking account…</span>
                        ) : user ? (
                            <div className="relative hidden items-center gap-3 xl:flex">
                                <Link to="/dashboard" className="public-account-link min-h-11 inline-flex items-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Dashboard</Link>
                                {["admin", "superAdmin", "contentAdmin", "mediaAdmin", "ministryAdmin"].includes(user.role) && <Link to="/admin" className="public-account-link min-h-11 inline-flex items-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Admin</Link>}
                                <button
                                    type="button"
                                    onClick={() => setProfileOpen((open) => !open)}
                                    aria-expanded={profileOpen}
                                    className="min-h-11 rounded-lg px-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]"
                                >
                                    {user.firstName || "Account"}
                                </button>
                                {profileOpen && (
                                    <button
                                        type="button"
                                        onClick={() => { logoutUser(); setProfileOpen(false); }}
                                        className="absolute right-0 top-full mt-2 min-h-11 rounded-lg bg-white px-4 text-sm font-semibold text-[#0d1426] shadow-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b335]"
                                    >
                                        Sign out
                                    </button>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="public-account-link hidden min-h-11 items-center rounded-full border border-white/40 px-4 text-sm font-semibold transition-colors hover:border-[#f5b335] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b] xl:inline-flex">Login</Link>
                        )}

                        <button
                            ref={menuButtonRef}
                            type="button"
                            onClick={() => setMobileOpen((open) => !open)}
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#f5b335] text-[#f5b335] transition-colors hover:bg-[#f5b335]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b] xl:hidden"
                            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-navigation"
                        >
                            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        id="mobile-navigation"
                        aria-label="Mobile navigation"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.16 }}
                        className="mx-auto w-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[#1f2a44] bg-[#0d1426] px-4 pb-4 pt-2 shadow-xl sm:px-6 xl:hidden"
                    >
                        <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-1 sm:grid-cols-2">
                            {navItems.map(({ title, path }) => (
                                <li key={path}>
                                    <NavLink to={path} end={path === "/"} onClick={closeMobileMenu} className={mobileLinkClasses}>
                                        {title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className="mx-auto mt-3 flex w-full max-w-2xl flex-wrap gap-2 border-t border-white/10 pt-3">
                                <Link to="/donate" onClick={closeMobileMenu} className="public-give-link inline-flex min-h-11 items-center justify-center rounded-full bg-[#f5b335] px-5 text-sm font-bold transition-colors hover:bg-[#ffd46b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Give Now</Link>
                            {loading ? (
                                <span className="inline-flex min-h-11 items-center px-3 text-sm text-slate-300" role="status">Checking account…</span>
                            ) : user ? (
                                <>
                                    <Link to="/dashboard" onClick={closeMobileMenu} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm font-semibold text-white hover:border-[#f5b335] hover:text-[#ffd46b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Dashboard</Link>
                                {["admin", "superAdmin", "contentAdmin", "mediaAdmin", "ministryAdmin"].includes(user.role) && <Link to="/admin" onClick={closeMobileMenu} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm font-semibold text-white hover:border-[#f5b335] hover:text-[#ffd46b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Admin</Link>}
                                    <button type="button" onClick={() => { logoutUser(); closeMobileMenu(); }} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm font-semibold text-white hover:border-[#f5b335] hover:text-[#ffd46b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Sign out</button>
                                </>
                            ) : (
                                <Link to="/login" onClick={closeMobileMenu} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm font-semibold text-white hover:border-[#f5b335] hover:text-[#ffd46b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd46b]">Login</Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
