import type { Request, Response, NextFunction } from "express";
import { createError, verifyToken } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";

// Cookie Options
export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? ("none" as "none")
            : ("strict" as "strict"),
};

export type tokenPayload = {
    id: string;
    email: string;
    role: "admin" | "user" | "author";
};

declare global {
    namespace Express {
        interface Request {
            user?: tokenPayload;
        }
    }
}

// Middleware checks if user is authenticated or not via Cookies
export const checkUserAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return next(
            createError(
                "Unauthenticated Request",
                StatusCodes.UNAUTHORIZED,
                "You need to login to perform this action"
            )
        );
    }

    try {
        const decrypted = verifyToken(access_token);
        req.user = decrypted as tokenPayload;
    } catch (error) {
        return res
            .clearCookie("access_token", cookieOptions)
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                success: false,
                statusCode: StatusCodes.UNAUTHORIZED,
                message: "Authentication failed!",
            });
    }

    next();
};

// Checks if user is already logged in or not. For `/login` and `/register`
export const checkAlreadyLoggedIn = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return next();
    }

    try {
        verifyToken(access_token);
        next(createError("You are already Logged In", StatusCodes.BAD_REQUEST));
    } catch (error) {
        next();
    }
};

// Check if user is Admin using the parsed data from authentication middleware
export const checkAdminAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;

    if (user?.role !== "admin") {
        return next(
            createError(
                "Unauthorized Request",
                StatusCodes.FORBIDDEN,
                "You must be an Admin to perform this action"
            )
        );
    }

    next();
};
