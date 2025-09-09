import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { GuideModel } from "../../models/guide.js";
import { createError } from "../../utils/index.js";
import { getGuidePagePipeline } from "../../db/pipelines.js";

// Get All Guides
export const getAllGuides = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const searchParams = req.query;
    const limit = parseInt(String(searchParams.limit ?? 10));
    const page = parseInt(String(searchParams.page ?? 1));
    const query = searchParams.query ?? "";
    const category = searchParams.category;
    const tag = searchParams.tag;
    const sort = searchParams.sort ?? "new";

    let skip = limit * (page - 1);
    skip = isNaN(skip) || skip < 1 ? 0 : skip;

    // Create Filter
    const filter: any = {};

    if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
    if (tag) filter.tag = { $regex: `^${tag}$`, $options: "i" };
    if (query) filter.title = { $regex: query, $options: "i" };

    try {
        const guides = await GuideModel.find(filter, {
            title: 1,
            category: 1,
            tag: 1,
        })
            .sort({ createdAt: sort === "new" ? -1 : 1 })
            .skip(skip)
            .limit(isNaN(limit) ? 10 : limit);

        const totalCount = await GuideModel.countDocuments(filter);

        const pagination = {
            has_next_page: totalCount > skip + guides.length,
            current_page: page,
            current_count: guides.length,
            total_count: totalCount,
            limit,
        };

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Guides fetched successfully",
            pagination,
            data: guides,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch Guides",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Get Guide Page
export const getGuidePage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, tag } = req.params;

    try {
        const response = await GuideModel.aggregate(
            getGuidePagePipeline(category, tag)
        );
        if (response.length === 0) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Guide fetched Successfully",
            ...response[0],
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch Guide",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};
