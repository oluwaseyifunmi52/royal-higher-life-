import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    HiOutlineBars3,
    HiOutlineXMark,
} from "react-icons/hi2";
import { HiChevronDown } from "react-icons/hi";

import MobileMenu from "./MobileMenu";
import logo from "../assets/royal logo.jpeg";

const navItems = [
    {
        title: "About",
        path: "/about",
        children: [
            { title: "Overview", path: "/about#overview" },
            { title: "Mission", path: "/about#mission" },
            { title: "Founder", path: "/about#founder" },
        ],
    },
    {
        title: "Mission",
        path: "/mission",
        children: [
            { title: "Church Planting", path: "/mission#church" },
            { title: "Evangelism", path: "/mission#evangelism" },
            { title: "Community", path: "/mission#community" },
        ],
    },
    {
        title: "Media",
        path: "/media",
        children: [
            { title: "Videos", path: "/media#videos" },
            { title: "Gallery", path: "/media#gallery" },
            { title: "Live Stream", path: "/media#live" },
        ],
    },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                <img src={logo} alt="Royal Higher Life" />
            </Link>

            <button
                className="menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
            </button>

            <MobileMenu isOpen={isOpen}>
                <ul className="nav-list">

                    <li>
                        <NavLink className="nav-link" to="/">
                            Home
                        </NavLink>
                    </li>

                    {navItems.map((item) => (
                        <li key={item.title} className="dropdown">

                            <NavLink
                                className="nav-link"
                                to={item.path}
                            >
                                {item.title}
                                <HiChevronDown className="dropdown-icon" />
                            </NavLink>

                            <ul className="dropdown-menu">

                                {item.children.map((child) => (
                                    <li key={child.path}>
                                        <Link
                                            to={child.path}
                                            onClick={closeMenu}
                                        >
                                            {child.title}
                                        </Link>
                                    </li>
                                ))}

                            </ul>

                        </li>
                    ))}

                    <li>
                        <NavLink className="nav-link" to="/reviews">
                            Reviews
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className="donate-btn" to="/donate">
                            Donate
                        </NavLink>
                    </li>

                    <li>
                        <NavLink className="nav-link" to="/contact">
                            Contact
                        </NavLink>
                    </li>

                </ul>
            </MobileMenu>

        </nav>
    );
}