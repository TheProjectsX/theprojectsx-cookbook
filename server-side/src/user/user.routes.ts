import express from "express";
// Route Controllers
import {
    createSnippet,
    deleteSnippet,
    getCategories,
    getSnippets,
    updateSnippet,
} from "./user.controller.js";

// Validation Schemas
import {
    createSnippetSchema,
    updateSnippetSchema,
} from "../validators/body.validator.js";

// MiddleWares
import { checkUserAuthentication } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = express.Router();

// Get Categories of Snippets
router.get("/snippets/categories", getCategories);

// Create new Snippet
router.post("/snippets", validateSchema(createSnippetSchema), createSnippet);

// Get all Snippets
router.get("/snippets", getSnippets);

// Update a Snippet
router.put("/snippets/:id", validateSchema(updateSnippetSchema), updateSnippet);

// Delete a Snippet
router.delete("/snippets/:id", deleteSnippet);

export default router;
