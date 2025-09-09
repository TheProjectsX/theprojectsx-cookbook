import express from "express";

// Route Controllers
import { getAllGuides, getGuidePage } from "./guides.controller.js";

const router = express.Router();

// Get All Guides
router.get("/", getAllGuides);

// Get guide page
router.get("/:category/:tag", getGuidePage);

export default router;
