import { Router } from "express";
import adminAuth from "../middleware/adminAuth.js";
import requireSuperAdmin from "../middleware/adminAuth.js";
import {
    getAdmins,
    createAdmin,
    getAdminById,
    updateAdmin,
    suspendAdmin,
    activateAdmin,
    resetAdminPassword,
    revokeAdminSessions,
    sendAdminInvitation,
} from "../controllers/adminController.js";

const router = Router();

// All routes require admin authentication
router.use(adminAuth);

// Super admin only routes
router.use(requireSuperAdmin);

// Administrator management
router.get("/admins", getAdmins);
router.post("/admins", createAdmin);
router.get("/admins/:id", getAdminById);
router.put("/admins/:id", updateAdmin);
router.put("/admins/:id/suspend", suspendAdmin);
router.put("/admins/:id/activate", activateAdmin);
router.post("/admins/:id/reset-password", resetAdminPassword);
router.post("/admins/:id/revoke-sessions", revokeAdminSessions);
router.post("/admins/:id/send-invitation", sendAdminInvitation);

export default router;