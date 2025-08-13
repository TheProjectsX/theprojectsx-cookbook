import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (
    err: Error & {
        statusCode?: number;
        error?: any;
    },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(err.error ? { error: err.error } : {}),
    });
};
