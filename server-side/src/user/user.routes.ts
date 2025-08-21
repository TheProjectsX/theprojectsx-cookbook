import express from "express";
import { loginUser, logoutUser, registerUser } from "./user.controller.js";
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

export default router;
