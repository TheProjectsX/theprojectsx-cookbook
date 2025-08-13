import type { Request, Response, NextFunction } from "express";

export const checkAdminAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next();
};
