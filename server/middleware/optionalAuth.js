import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Attaches req.user when a valid token is supplied, but never blocks guest
 * donations. Donation forms remain usable without an account.
 */
const optionalAuth = async (req, _res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) req.user = user;
    } catch {
        // A bad/expired token does not prevent a guest donation.
    }
    next();
};

export default optionalAuth;
