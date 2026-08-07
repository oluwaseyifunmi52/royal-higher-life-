import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "royal-higher-life-secret-key");
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access required." });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};
export default adminAuth;
