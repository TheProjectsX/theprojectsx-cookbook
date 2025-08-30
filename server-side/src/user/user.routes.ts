import express from "express";
// Route Controllers
import {
    createSnippet,
    deleteSnippet,
    getCategories,
    getSnippets,
    loginUser,
    logoutUser,
    registerUser,
    updateSnippet,
} from "./user.controller.js";

// Validation Schemas
import {
    loginSchema,
    registerSchema,
    createSnippetSchema,
    updateSnippetSchema,
} from "../validators/body.validator.js";

// MiddleWares
import {
    checkAlreadyLoggedIn,
    checkUserAuthentication,
} from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = express.Router();

/* Public Routes */

// Register new User
router.post(
    "/register",
    checkAlreadyLoggedIn,
    validateSchema(registerSchema),
    registerUser
);

// Login User
router.post(
    "/login",
    checkAlreadyLoggedIn,
    validateSchema(loginSchema),
    loginUser
);

/* Private Routes */

// Logout User
router.get("/logout", checkUserAuthentication, logoutUser);

// Get Categories of Snippets
router.get("/me/snippets/categories", checkUserAuthentication, getCategories);

// Create new Snippet
router.post(
    "/me/snippets",
    checkUserAuthentication,
    validateSchema(createSnippetSchema),
    createSnippet
);

// Get all Snippets
router.get("/me/snippets", checkUserAuthentication, getSnippets);

// Update a Snippet
router.put(
    "/me/snippets/:id",
    checkUserAuthentication,
    validateSchema(updateSnippetSchema),
    updateSnippet
);

// Delete a Snippet
router.delete("/me/snippets/:id", checkUserAuthentication, deleteSnippet);

export default router;
