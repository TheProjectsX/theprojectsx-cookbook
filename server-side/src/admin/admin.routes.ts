import express from "express";
// Route Controllers
import { createGuide, deleteGuide, updateGuide } from "./admin.controller.js";

// Validation Schemas
import {
    createGuideSchema,
    updateGuideSchema,
} from "../validators/body.validator.js";

// MiddleWares
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = express.Router();

// Create Guide
router.post("/guides", validateSchema(createGuideSchema), createGuide);

// Update Guide
router.put("/guide/:id", validateSchema(updateGuideSchema), updateGuide);

// Delete Guide
router.delete("/guide/:id", deleteGuide);

export default router;
