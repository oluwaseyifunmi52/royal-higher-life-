import { Router } from "express";
import auth from "../middleware/auth.js";
import optionalAuth from "../middleware/optionalAuth.js";
import {
    confirmTracking,
    createDonation,
    getCampaigns,
    getCurrencies,
    getMyDonations,
    requestTracking,
    verifyDonation,
} from "../controllers/donationController.js";

const router = Router();

// Public configuration and campaigns
router.get("/currencies", getCurrencies);
router.get("/campaigns", getCampaigns);

// Donation creation and provider verification
router.post("/", optionalAuth, createDonation);
router.post("/verify", verifyDonation);

// Signed-in donor history
router.get("/mine", auth, getMyDonations);

// Receipt lookup by email one-time code
router.post("/track/request", requestTracking);
router.post("/track/confirm", confirmTracking);

export default router;
