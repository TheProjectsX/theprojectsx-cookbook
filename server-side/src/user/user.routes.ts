import express from "express";
import {
    createSnippet,
    deleteSnippet,
    getSnippets,
    loginUser,
    logoutUser,
    registerUser,
    updateSnippet,
} from "./user.controller.js";
import {
    checkAlreadyLoggedIn,
    checkUserAuthentication,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

/* Public Routes */

// Register new User
router.post("/register", checkAlreadyLoggedIn, registerUser);

// Login User
router.post("/login", checkAlreadyLoggedIn, loginUser);

/* Private Routes */

// Logout User
router.get("/logout", checkUserAuthentication, logoutUser);

// Create new Snippet
router.post("/me/snippets", checkUserAuthentication, createSnippet);

// Get all Snippets
router.get("/me/snippets", checkUserAuthentication, getSnippets);

// Update a Snippet
router.put("/me/snippets/:id", checkUserAuthentication, updateSnippet);

// Delete a Snippet
router.delete("/me/snippets/:id", checkUserAuthentication, deleteSnippet);

export default router;
