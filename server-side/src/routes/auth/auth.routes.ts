import express from "express";

// Route Controllers
import { loginUser, logoutUser, registerUser } from "./auth.controller.js";

// Validation Schema
import {
    loginSchema,
    registerSchema,
} from "../../validators/body.validator.js";

// Middleware
import { validateSchema } from "../../middlewares/validator.middleware.js";
import {
    checkAlreadyLoggedIn,
    checkUserAuthentication,
} from "../../middlewares/auth.middleware.js";

const router = express.Router();

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
router.post("/logout", checkUserAuthentication, logoutUser);

export default router;
