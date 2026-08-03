import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const response = (success, message, data = null) => ({ success, message, data });

// In-memory storage (resets when the server restarts).
// Swap these with a database (e.g. MongoDB/Postgres) for production.
const users = [];
const submissions = { contact: [], prayer: [], donation: [], review: [] };
const tokens = new Map(); // token -> email

const JWT_EXPIRY_MS = 24 * 60 * 60 * 1000;

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    return scrypt(password, salt, 64).then((key) => `${salt}:${key.toString("hex")}`);
}

async function verifyPassword(password, stored) {
    const [salt, key] = stored.split(":");
    const derived = await scrypt(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), derived);
}

function issueToken(email) {
    const token = crypto.randomBytes(32).toString("hex");
    tokens.set(token, { email, issuedAt: Date.now() });
    return token;
}

function getTokenUser(req) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    const session = tokens.get(token);
    if (!session) return null;
    if (Date.now() - session.issuedAt > JWT_EXPIRY_MS) {
        tokens.delete(token);
        return null;
    }
    return users.find((u) => u.email === session.email) || null;
}

const requireFields = (body, fields) => {
    const missing = fields.filter(
        (field) => body[field] === undefined || String(body[field]).trim() === ""
    );
    if (missing.length) {
        throw new Error(`Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`);
    }
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const safeUser = (user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    phone: user.phone,
    country: user.country,
    state: user.state,
    gender: user.gender,
    newsletter: user.newsletter,
    emailVerified: user.emailVerified,
    role: user.role,
    createdAt: user.createdAt,
});

// ------------------------- Auth -------------------------

app.post("/api/auth/register", async (req, res, next) => {
    try {
        requireFields(req.body, ["firstName", "lastName", "email", "password"]);

        const email = req.body.email.trim().toLowerCase();

        if (!isValidEmail(email)) {
            return res.status(400).json(response(false, "Please provide a valid email address."));
        }

        if (req.body.password.length < 8) {
            return res.status(400).json(response(false, "Password must be at least 8 characters."));
        }

        if (users.some((u) => u.email === email)) {
            return res.status(409).json(response(false, "An account with this email already exists."));
        }

        const user = {
            id: crypto.randomUUID(),
            firstName: req.body.firstName.trim(),
            lastName: req.body.lastName.trim(),
            email,
            phone: req.body.phone?.trim() || "",
            country: req.body.country?.trim() || "",
            state: req.body.state?.trim() || "",
            gender: req.body.gender?.trim() || "",
            newsletter: Boolean(req.body.newsletter),
            password: await hashPassword(req.body.password),
            emailVerified: true,
            role: "member",
            createdAt: new Date().toISOString(),
        };

        users.push(user);
        res.json(response(true, "Account created successfully.", { user: safeUser(user) }));
    } catch (err) {
        next(err);
    }
});

app.post("/api/auth/login", async (req, res, next) => {
    try {
        requireFields(req.body, ["email", "password"]);

        const email = req.body.email.trim().toLowerCase();
        const user = users.find((u) => u.email === email);

        if (!user || !(await verifyPassword(req.body.password, user.password))) {
            return res.status(401).json(response(false, "Invalid email or password."));
        }

        const token = issueToken(email);
        res.json(response(true, "Login successful.", { token, user: safeUser(user) }));
    } catch (err) {
        next(err);
    }
});

app.get("/api/auth/profile", (req, res) => {
    const user = getTokenUser(req);

    if (!user) {
        return res.status(401).json(response(false, "Not authenticated."));
    }

    res.json(response(true, "Profile fetched.", { user: safeUser(user) }));
});

app.post("/api/auth/verify-email", (req, res) => {
    const user = req.body.email
        ? users.find((u) => u.email === req.body.email.trim().toLowerCase())
        : null;

    if (!user) {
        return res.status(404).json(response(false, "Account not found."));
    }

    user.emailVerified = true;
    res.json(response(true, "Email verified successfully."));
});

app.post("/api/auth/resend-otp", (req, res) => {
    res.json(response(true, "Verification code sent."));
});

app.post("/api/auth/forgot-password", (req, res) => {
    const user = req.body.email
        ? users.find((u) => u.email === req.body.email.trim().toLowerCase())
        : null;

    if (!user) {
        return res.status(404).json(response(false, "No account found for this email."));
    }

    res.json(response(true, "Password reset instructions sent to your email."));
});

app.post("/api/auth/reset-password", async (req, res, next) => {
    try {
        requireFields(req.body, ["email", "password"]);

        const email = req.body.email.trim().toLowerCase();
        const user = users.find((u) => u.email === email);

        if (!user) {
            return res.status(404).json(response(false, "No account found for this email."));
        }

        if (req.body.password.length < 8) {
            return res.status(400).json(response(false, "Password must be at least 8 characters."));
        }

        user.password = await hashPassword(req.body.password);
        res.json(response(true, "Password updated successfully."));
    } catch (err) {
        next(err);
    }
});

// ------------------------- Public submissions -------------------------

function submitHandler(kind) {
    return (req, res, next) => {
        try {
            const entry = { ...req.body, receivedAt: new Date().toISOString() };
            submissions[kind].push(entry);

            const messages = {
                contact: "Contact message received.",
                prayer: "Prayer request received.",
                donation: "Donation processed successfully.",
                review: "Review saved successfully.",
            };

            res.json(response(true, messages[kind], entry));
        } catch (err) {
            next(err);
        }
    };
}

app.post("/api/contacts", submitHandler("contact"));
app.post("/api/prayers", submitHandler("prayer"));
app.post("/api/donations", submitHandler("donation"));
app.post("/api/reviews", submitHandler("review"));

// Backwards-compatible singular aliases
app.post("/api/contact", submitHandler("contact"));
app.post("/api/prayer", submitHandler("prayer"));
app.post("/api/donate", submitHandler("donation"));
app.post("/api/review", submitHandler("review"));

app.get("/api/health", (req, res) => {
    res.json(response(true, "Server is running."));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json(response(false, `Route not found: ${req.method} ${req.path}`));
});

// Central error handler
app.use((err, req, res, _next) => {
    console.error("Server error:", err);
    res.status(500).json(response(false, "Something went wrong on the server."));
});

app.listen(port, () => {
    console.log(`Royal Higher Life backend listening on http://localhost:${port}`);
});
