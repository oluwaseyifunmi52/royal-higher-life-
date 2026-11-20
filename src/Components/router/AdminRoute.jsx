import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

function canAccessAdminPath(role, pathname) {
    if (pathname === "/admin" || pathname === "/admin/") return true;
    const rawPath = pathname.replace(/^\/admin\/?/, "").split("/")[0] || "dashboard";
    const path = ["prayers", "messages", "volunteers", "partnerships", "event-registrations"].includes(rawPath) ? "submissions" : rawPath;
    if (path === "dashboard") return true;
    if (role === "superAdmin" || role === "admin") return path !== "users" || role === "superAdmin";
    const scopes = {
        contentAdmin: ["content", "settings", "gallery", "sermons", "events", "announcements", "testimonies", "ministries"],
        mediaAdmin: ["media", "gallery"],
        ministryAdmin: ["events", "ministries", "submissions"],
    };
    return (scopes[role] || []).includes(path);
}

const AdminRoute = ({ children, superAdminOnly = false }) => {
    const token = localStorage.getItem("token");
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(null);
    const [routeAllowed, setRouteAllowed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                const role = response.data?.user?.role;
                if (["admin", "superAdmin", "contentAdmin", "mediaAdmin", "ministryAdmin"].includes(role)) sessionStorage.setItem("adminRole", role);
                else sessionStorage.removeItem("adminRole");
                const admin = Boolean(response.data?.success && ["admin", "superAdmin", "contentAdmin", "mediaAdmin", "ministryAdmin"].includes(role));
                setIsAdmin(admin);
                setRouteAllowed(admin && (superAdminOnly ? role === "superAdmin" : canAccessAdminPath(role, location.pathname)));
            })
            .catch(() => {
                sessionStorage.removeItem("adminRole");
                setIsAdmin(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token, location.pathname, superAdminOnly]);

    if (!token) {
            return <Navigate to="/admin/login" replace state={{ from: location, ...(superAdminOnly ? { reason: "super-admin-required" } : {}) }} />;
    }

    if (loading) {
        return <div className="page-fallback" role="status">Loading...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace state={{ from: location, reason: superAdminOnly ? "super-admin-required" : "admin-required" }} />;
    }

    if (!routeAllowed) return <main className="admin-auth-page"><section className="admin-auth-card"><h1>Access denied</h1><p className="admin-auth-intro">{superAdminOnly ? "Only a Super Admin can create or manage administrator accounts." : "Your administrator role cannot open this section."}</p></section></main>;

    return children;
};

export default AdminRoute;
