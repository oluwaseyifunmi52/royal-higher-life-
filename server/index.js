import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const response = (success, message, data = null) => ({ success, message, data });

app.post("/api/contact", (req, res) => {
    const contact = req.body;
    console.log("Contact request:", contact);
    res.json(response(true, "Contact message received."));
});

app.post("/api/prayer", (req, res) => {
    const prayer = req.body;
    console.log("Prayer request:", prayer);
    res.json(response(true, "Prayer request received."));
});

app.post("/api/donate", (req, res) => {
    const donation = req.body;
    console.log("Donation request:", donation);
    res.json(response(true, "Donation processed successfully."));
});

app.post("/api/review", (req, res) => {
    const review = req.body;
    console.log("Review request:", review);
    res.json(response(true, "Review saved successfully."));
});

app.get("/api/health", (req, res) => {
    res.json(response(true, "Server is running."));
});

app.listen(port, () => {
    console.log(`Royal Higher Life backend listening on http://localhost:${port}`);
});
