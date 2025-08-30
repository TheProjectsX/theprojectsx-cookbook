import type { Request, Response, NextFunction } from "express";
import { GuideModel } from "../models/guide.js";
import { createError } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { getGuidePagePipeline } from "../db/pipelines.js";

export const getGuidePage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, tag } = req.params;

    try {
        const response = await GuideModel.aggregate(
            getGuidePagePipeline(category, tag)
        )
        if (response.length === 0) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Guide parsed Successfully",
            ...response[0],
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to parse Guide",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};
