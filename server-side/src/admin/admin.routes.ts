import express from "express";
// Route Controllers
import {
    createCategory,
    createGuide,
    createSection,
    deleteCategory,
    deleteGuide,
    deleteSection,
    getCategories,
    getGuide,
    getSection,
    updateCategory,
    updateGuide,
    updateSection,
} from "./admin.controller.js";

// Validation Schemas
import {
    createGuideSchema,
    createSectionSchema,
    updateGuideSchema,
    updateSectionSchema,
} from "../validators/body.validator.js";

// MiddleWares
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = express.Router();

// -------- Category --------

// Create Category
router.post("/categories", createCategory);

// Get Categories
router.get("/categories", getCategories);

// Update Category
router.put("/categories/:id", updateCategory);

// Delete Category
router.delete("/categories/:id", deleteCategory);

// -------- Guides --------

// Create Guide
router.post("/guides", validateSchema(createGuideSchema), createGuide);

// Get single Guide
router.get("/guides/:id", getGuide);

// Update Guide
router.put("/guides/:id", validateSchema(updateGuideSchema), updateGuide);

// Delete Guide
router.delete("/guides/:id", deleteGuide);

// -------- Sections --------

// Create Section
router.post(
    "/guides/:id/sections",
    validateSchema(createSectionSchema),
    createSection
);

// Get single Section
router.get("/sections/:id", getSection);

// Update Section
router.put("/sections/:id", validateSchema(updateSectionSchema), updateSection);

// Delete Section
router.delete("/sections/:id", deleteSection);

export default router;
