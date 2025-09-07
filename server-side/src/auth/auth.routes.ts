import express from "express";
import {
    checkAlreadyLoggedIn,
    checkUserAuthentication,
} from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/body.validator.js";
import { loginUser, logoutUser, registerUser } from "./auth.controller.js";

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
router.get("/logout", checkUserAuthentication, logoutUser);

export default router;
