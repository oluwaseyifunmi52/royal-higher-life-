import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const API_URL =
            import.meta.env.VITE_API_URL || "https://royal-higher-life-backend-4.onrender.com";

        fetch(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setIsAdmin(data.user?.role === "admin");
            })
            .catch(() => {
                setIsAdmin(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (loading) {
        return <div className="page-fallback" role="status">Loading...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;
