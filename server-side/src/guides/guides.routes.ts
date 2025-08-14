import express from "express";
import { getGuidePage } from "./guides.controller.js";

const router = express.Router();

// Get guide page
router.get("/:category/:tag", getGuidePage);

export default router;
