import express from "express";
import {
    createGuide,
    deleteGuide,
    loginAdmin,
    logoutAdmin,
    updateGuide,
} from "./admin.controller.js";
import { checkAdminAuthorization } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login (Only open route)
router.post("/login", loginAdmin);

// Logout
router.get("/logout", checkAdminAuthorization, logoutAdmin);

// Create Guide
router.post("/guides", checkAdminAuthorization, createGuide);

// Update Guide
router.put("/guide/:id", checkAdminAuthorization, updateGuide);

// Delete Guide
router.delete("/guide/:id", checkAdminAuthorization, deleteGuide);

export default router;
