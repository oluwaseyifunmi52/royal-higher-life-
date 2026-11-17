import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Role hierarchy: super_admin has access to everything
// admin can manage content admins and below
// Other roles have specific permissions checked in controllers

const ADMIN_ROLES = ["super_admin", "admin"];
const CONTENT_ADMIN_ROLES = ["content_admin", "super_admin"];
const FINANCE_ADMIN_ROLES = ["finance_admin", "super_admin"];
const PRAYER_SUPPORT_ROLES = ["prayer_support_admin", "super_admin"];
const REVIEWER_ROLES = ["content_reviewer", "super_admin"];

const isSuperAdmin = (role) => role === "super_admin";
const isAdminLevel = (role) => ADMIN_ROLES.includes(role);

export const adminAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided." });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }
        if (user.isActive === false) {
            return res.status(403).json({ success: false, message: "Account is disabled." });
        }
        if (!isAdminLevel(user.role) && !isSuperAdmin(user.role)) {
            return res.status(403).json({ success: false, message: "Admin access required." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

// Middleware to check specific roles
export const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ success: false, message: "No token provided." });
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ success: false, message: "User not found." });
            }
            if (user.isActive === false) {
                return res.status(403).json({ success: false, message: "Account is disabled." });
            }

            // Super admin can do anything
            if (user.role === "super_admin") {
                req.user = user;
                return next();
            }

            // Check if user has required role
            if (allowedRoles.includes(user.role)) {
                req.user = user;
                return next();
            }

            return res.status(403).json({ success: false, message: "Insufficient permissions." });
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token." });
        }
    };
};

// Middleware to check that only super_admin can promote/create other super admins
export const requireSuperAdminForSuperAdmin = async (req, res, next) => {
    if (req.user.role !== "super_admin") {
        return res.status(403).json({ success: false, message: "Only super administrators can perform this action." });
    }
    next();
};

export default adminAuth;