import express from "express";
// Route Controllers
import {
    createAvatar,
    createCategory,
    createGuide,
    createSection,
    deleteAvatar,
    deleteCategory,
    deleteGuide,
    deleteSection,
    getCategories,
    getGuide,
    getSection,
    getStatistics,
    updateAvatar,
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

// -------- Statistics --------
router.get("/statistics", getStatistics);

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

// -------- Avatar --------

// Create Avatar
router.post("/avatar", createAvatar);

// Update Avatar
router.put("/avatar/:id", updateAvatar);

// Delete Avatar
router.delete("/avatar/:id", deleteAvatar);

export default router;
