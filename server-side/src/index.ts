import express, { NextFunction, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

// Routes
import GuideRoutes from "./guides/guides.routes.js";
import NavigationRoutes from "./nav/nav.routes.js";
import AdminRoutes from "./admin/admin.routes.js";

// Middleware
import { checkAdminAuthorization } from "./middlewares/auth.middleware.js";
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

// Navigation Routes
app.use("/navigation", NavigationRoutes);

// Admin Routes
app.use("/admin", checkAdminAuthorization, AdminRoutes);

// 404 - Page not found
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError("Not Found", 404));
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
