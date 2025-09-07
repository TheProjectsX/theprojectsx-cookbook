import express, { NextFunction, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

// Routes
import GuideRoutes from "./guides/guides.routes.js";
import InfoRoutes from "./info/info.routes.js";
import AuthRoutes from "./auth/auth.routes.js";
import UserRoutes from "./user/user.routes.js";
import AdminRoutes from "./admin/admin.routes.js";

// Middleware
import {
    checkAdminAuthorization,
    checkUserAuthentication,
} from "./middlewares/auth.middleware.js";
import { createError } from "./utils/index.js";

// Configure App
dotenv.config({ quiet: true });

const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", async (req: Request, res: Response) => {
    res.json({ success: true, message: "Server Working Fine! ✌️" });
});

// Injecting Routes

// Guides Routes
app.use("/guides", GuideRoutes);

// Information Routes
app.use("/info", InfoRoutes);

// Authentication Routes
app.use("/auth", AuthRoutes);

// User Routes (All User Routes are Authenticated)
app.use("/me", checkUserAuthentication, UserRoutes);

// Admin Routes
app.use(
    "/admin",
    checkUserAuthentication,
    checkAdminAuthorization,
    AdminRoutes
);

// 404 - Page not found
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError("Route Not Found", 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Connect Database and Start App
console.log("Starting...");
connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(
            `Server running on http://localhost:${process.env.PORT || 5000}`
        );
    });
});
