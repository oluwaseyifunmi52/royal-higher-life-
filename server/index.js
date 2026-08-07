import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import submissionRoutes from "./routes/submissions.js";
import eventRoutes from "./routes/events.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const ALLOWED_ORIGINS = [
    process.env.CLIENT_URL,
    "https://royal-higher-life-v9tt.vercel.app",
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
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json({ limit: "5mb" }));

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
app.use("/api", submissionRoutes);
app.use("/api", eventRoutes);
app.use("/api/admin", adminRoutes);

// Backwards-compatible singular aliases for public submissions
import {
    createContact,
    createPrayer,
    createDonation,
    createReview,
} from "./controllers/submissionController.js";

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
    console.error("Server error:", err);
    res.status(500).json(response(false, "Something went wrong on the server."));
});

// ------------------------- Database & Server Start -------------------------

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Please configure it in your environment variables.");
    console.error("The server will start but database operations will fail.");
}

mongoose
    .connect(MONGODB_URI || "")
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Royal Higher Life backend listening on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        console.error("Starting server without database connection...");
        app.listen(port, () => {
            console.log(`Royal Higher Life backend listening on http://localhost:${port} (NO DB)`);
        });
    });
