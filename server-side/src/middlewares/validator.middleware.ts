import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { createError } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";

export const validateSchema =
    (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);

            next();
        } catch (err: any) {
            if (err instanceof ZodError) {
                const formattedErrors = err.issues.map((error) => ({
                    field: error.path[0],
                    message:
                        error.code === "invalid_type"
                            ? error.input === undefined &&
                              error.path.length !== 0
                                ? `${error.path[0]?.toString()} is required`
                                : error.message
                            : error.message,
                }));
                next(
                    createError(
                        "Invalid Body Provided",
                        StatusCodes.BAD_REQUEST,
                        formattedErrors
                    )
                );
            } else {
                next(createError());
            }
        }
    };
