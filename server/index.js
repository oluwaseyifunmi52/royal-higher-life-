import "./_env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import socialAuthRoutes from "./routes/socialAuth.js";
import submissionRoutes from "./routes/submissions.js";
import eventRoutes from "./routes/events.js";
import adminRoutes from "./routes/admin.js";
import adminManagementRoutes from "./routes/admin-management.js";
import donationRoutes from "./routes/donations.js";
import { paypalWebhook, paystackWebhook, createDonation } from "./controllers/donationController.js";
import {
    createContact,
    createPrayer,
    createReview,
} from "./controllers/submissionController.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    if (process.env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
});
const port = process.env.PORT || 8000;

const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    "https://royal-higher-life-v9tt.vercel.app",
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:3000",
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: false,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Payment webhooks must receive the raw request body for signature checks,
// so they are mounted before the JSON body parser.
app.post(
    "/api/donations/webhooks/paystack",
    express.raw({ type: "application/json", limit: "1mb" }),
    paystackWebhook
);
app.post(
    "/api/donations/webhooks/paypal",
    express.raw({ type: "application/json", limit: "1mb" }),
    paypalWebhook
);

app.use(express.json({ limit: "1mb" }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many authentication attempts. Try again later." },
});
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 3 : 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many password reset attempts. Try again later." },
});
const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 20 : 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many submissions. Try again later." },
});
const donationVerifyLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 30 : 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many payment checks. Please wait and try again." },
});
const donationTrackingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === "production" ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many receipt lookup attempts. Try again later." },
});

app.use("/api/auth/register", authLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/social", authLimiter);
app.use("/api/auth/forgot-password", resetLimiter);
app.use("/api/auth/reset-password", resetLimiter);
app.use(["/api/contacts", "/api/prayers", "/api/reviews", "/api/newsletter", "/api/testimonies", "/api/events/register", "/api/volunteers", "/api/partnerships", "/api/contact", "/api/prayer", "/api/review"], submissionLimiter);
app.post("/api/donations", submissionLimiter);
app.post("/api/donate", submissionLimiter);
app.use("/api/donations/verify", donationVerifyLimiter);
app.use("/api/donations/track", donationTrackingLimiter);

app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

const response = (success, message, data = null) => ({ success, message, data });

// ------------------------- Health -------------------------

app.get("/", (_req, res) => {
    res.json({ message: "Royal HigherLife API is running" });
});

app.get("/api/health", (_req, res) => {
    res.json(response(true, "Server is running."));
});

// ------------------------- Routes -------------------------

app.use("/api/auth", authRoutes);
app.use("/api/auth/social", socialAuthRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api", submissionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/management", adminManagementRoutes);

// Public read routes for sermons, gallery, reviews
app.get("/api/sermons", async (_req, res) => {
    try {
        const Sermon = (await import("./models/Sermon.js")).default;
        const sermons = await Sermon.find().sort({ date: -1 });
        res.json({ success: true, message: "Sermons fetched.", data: sermons });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch sermons." });
    }
});

app.get("/api/gallery", async (_req, res) => {
    try {
        const Gallery = (await import("./models/Gallery.js")).default;
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json({ success: true, message: "Gallery images fetched.", data: images });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch gallery images." });
    }
});

app.get("/api/reviews", async (_req, res) => {
    try {
        const Review = (await import("./models/Review.js")).default;
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ success: true, message: "Reviews fetched.", data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch reviews." });
    }
});

// Backwards-compatible singular aliases for public submissions
app.post("/api/contact", createContact);
app.post("/api/prayer", createPrayer);
app.post("/api/donate", createDonation);
app.post("/api/review", createReview);

// 404 handler
app.use((req, res) => {
    res.status(404).json(response(false, `Route not found: ${req.method} ${req.path}`));
});

// Central error handler
app.use((err, req, res, _next) => {
    console.error("Request failed.", { name: err?.name || "Error", code: err?.code || "unknown" });
    res.status(500).json(response(false, "Something went wrong on the server."));
});

// ------------------------- Database & Server Start -------------------------

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("Server startup aborted: required MONGODB_URI is missing.");
    process.exitCode = 1;
} else {
    mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
        .then(() => {
            console.info("MongoDB connection established.", {
                database: mongoose.connection.name,
                host: mongoose.connection.host,
            });
            app.listen(port, () => console.info(`Royal Higher Life backend listening on port ${port}`));
        })
        .catch((error) => {
            console.error("Server startup aborted: MongoDB connection failed.", {
                name: error.name || "MongoConnectionError",
                code: error.code || error.cause?.code || "unknown",
            });
            process.exitCode = 1;
        });
}
