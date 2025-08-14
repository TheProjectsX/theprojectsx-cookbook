import type { Request, Response, NextFunction } from "express";
import { createError, verifyToken } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";

export type tokenPayload = {
    username: string;
    role: "admin";
};

declare global {
    namespace Express {
        interface Request {
            user?: tokenPayload;
        }
    }
}

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? ("none" as "none")
            : ("strict" as "strict"),
};

export const checkAdminAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return next(createError("Not Found", StatusCodes.NOT_FOUND));
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
