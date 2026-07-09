import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import MobileMenu from "./MobileMenu.jsx";
import logo from "../assets/royal logo.jpeg";

const navItems = [
    {
        label: "About",
        to: "/about",
        links: [
            { label: "Overview", to: "/about#intro" },
            { label: "Mission", to: "/about#mission" },
            { label: "Founder", to: "/about#founder" },
        ],
    },
    {
        label: "Mission",
        to: "/mission",
        links: [
            { label: "Church Planting", to: "/mission#church" },
            { label: "Evangelism", to: "/mission#evangelism" },
            { label: "Community Support", to: "/mission#community" },
        ],
    },
    {
        label: "Media",
        to: "/media",
        links: [
            { label: "Videos", to: "/media#videos" },
            { label: "Live", to: "/media#live" },
            { label: "Gallery", to: "/media#gallery" },
        ],
    },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <header className="header">
            <Link className="logo" to="/" onClick={closeMenu}>
                <img src={logo} alt="Royal Higher Life Ministries Logo" />
            </Link>

            <button
                aria-label="Toggle navigation menu"
                className="menu-toggle"
                type="button"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "X" : "Menu"}
            </button>

            <MobileMenu isOpen={isOpen}>
                <ul className={`nav-list ${isOpen ? "active" : ""}`}>
                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                            to="/"
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>
                    </li>
                    {navItems.map((item) => (
                        <li className="nav-item dropdown" key={item.label}>
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                                to={item.to}
                                onClick={closeMenu}
                            >
                                {item.label} <span aria-hidden="true"></span>
                            </NavLink>
                            <ul className="dropdown-menu">
                                {item.links.map((link) => (
                                    <li key={link.to}>
                                        <Link to={link.to} onClick={closeMenu}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                            to="/reviews"
                            onClick={closeMenu}
                        >
                            Reviews
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                            to="/donate"
                            onClick={closeMenu}
                        >
                            Donate
                        </NavLink>
                    </li>
                    <li className="nav-item dropdown">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                            to="/contact"
                            onClick={closeMenu}
                        >
                            Contact <span aria-hidden="true"></span>
                        </NavLink>
                        <ul className="dropdown-menu">
                            <li>
                                <Link to="/contact#contactForm" onClick={closeMenu}>
                                    Contact Form
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact#prayerForm" onClick={closeMenu}>
                                    Prayer Request
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </MobileMenu>
        </header>
    );
}