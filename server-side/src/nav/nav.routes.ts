import express from "express";
import { getNavigationRoutes } from "./nav.controller.js";

const router = express.Router();

// Get navigation routes
router.get("/", getNavigationRoutes);

export default router;
