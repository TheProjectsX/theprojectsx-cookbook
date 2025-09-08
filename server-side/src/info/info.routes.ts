import express from "express";
import {
    getAvatars,
    getCategories,
    getNavigationRoutes,
} from "./info.controller.js";

const router = express.Router();

// Get Navigation routes
router.get("/navigation", getNavigationRoutes);

// Get Categories
router.get("/categories", getCategories);

// Get Avatars
router.get("/avatars", getAvatars);

export default router;
