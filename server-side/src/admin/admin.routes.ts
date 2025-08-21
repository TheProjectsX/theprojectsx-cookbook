import express from "express";
import { createGuide, deleteGuide, updateGuide } from "./admin.controller.js";
import {
    checkAdminAuthorization,
    checkUserAuthentication,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create Guide
router.post(
    "/guides",
    checkUserAuthentication,
    checkAdminAuthorization,
    createGuide
);

// Update Guide
router.put(
    "/guide/:id",
    checkUserAuthentication,
    checkAdminAuthorization,
    updateGuide
);

// Delete Guide
router.delete(
    "/guide/:id",
    checkUserAuthentication,
    checkAdminAuthorization,
    deleteGuide
);

export default router;
