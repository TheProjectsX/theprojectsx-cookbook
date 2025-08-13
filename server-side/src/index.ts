import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

// Routes
import GuideRoutes from "./guides/guides.routes.js";
import AdminRoutes from "./admin/admin.routes.js";
import { checkAdminAuthorization } from "./middlewares/auth.middleware.js";

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

// Admin Routes
app.use("/admin", checkAdminAuthorization, AdminRoutes);

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
