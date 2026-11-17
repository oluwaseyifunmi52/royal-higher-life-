import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../../api/axios";

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

        api.get("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setIsAdmin(response.data?.success ? response.data.user?.role === "admin" : false);
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