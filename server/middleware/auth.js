import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const REFRESH_TOKEN_EXPIRY = "30d";

export const auth = async (req, res, next) => {
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
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

// Generate refresh token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

// Login attempt tracking
export const trackLoginAttempt = async (email) => {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return;

    user.failedLoginAttempts = user.failedLoginAttempts + 1 || 1;

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCKOUT_DURATION;
    }

    await user.save();
    return user;
};

// Reset failed attempts on successful login
export const resetLoginAttempts = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        failedLoginAttempts: 0,
        lockUntil: undefined,
    });
};

// Check if account is locked
export const isAccountLocked = (user) => {
    if (user.lockUntil && user.lockUntil > Date.now()) {
        return true;
    }
    return false;
};

// Update last login
export const updateLastLogin = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        lastLogin: Date.now(),
        failedLoginAttempts: 0,
        lockUntil: undefined,
    });
};

export default auth;