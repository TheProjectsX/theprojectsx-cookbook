import express from "express";
import { createGuide, deleteGuide, updateGuide } from "./admin.controller.js";

const router = express.Router();

// Create Guide
router.post("/guides", createGuide);

// Update Guide
router.put("/guide/:id", updateGuide);

// Delete Guide
router.delete("/guide/:id", deleteGuide);

export default router;
