import express from "express";
import { getCategories, getNavigationRoutes } from "./info.controller.js";

const router = express.Router();

// Get navigation routes
router.get("/navigation", getNavigationRoutes);

// Get categories
router.get("/categories", getCategories);

export default router;
