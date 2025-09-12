import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

import { createError } from "../../utils/index.js";
import { SnippetModel } from "../../models/snippet.js";
import { UserModel } from "../../models/user.js";
import { cookieOptions } from "../../middlewares/auth.middleware.js";

// Get User Info
export const getUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        const response = await UserModel.findById(userId);
        if (!response) {
            return res
                .clearCookie("access_token", cookieOptions)
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: true,
                    statusCode: StatusCodes.UNAUTHORIZED,
                    message: "Unauthenticated Request",
                    error: "You need to login to perform this action",
                });
        }

        const { password, ...userInfo } = response.toObject();

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "User Info Fetched Successfully",
            ...userInfo,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch User Info",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Get all Categories of Snippets
export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;

    try {
        const categories = await SnippetModel.find(
            { user: userId },
            { _id: 0, category: 1 }
        );

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch Categories",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Create new Snippet
export const createSnippet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const { title, snippet } = req.body;

    try {
        const newSnippet = new SnippetModel({
            user: userId,
            title,
            snippet,
        });

        const response = await newSnippet.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "Snippet created Successfully",
            ...response.toObject(),
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Create Snippet",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Get All Snippets
export const getSnippets = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const searchParams = req.query;
    const limit = parseInt(String(searchParams.limit ?? 10));
    const page = parseInt(String(searchParams.page ?? 1));
    const query = searchParams.query ?? "";
    const category = searchParams.category;

    let skip = limit * (page - 1);
    skip = isNaN(skip) || skip < 1 ? 0 : skip;

    // Create Filter
    const filter: any = {
        user: userId,
    };

    if (category) filter.category = { $regex: `^${category}$`, $options: "i" };
    if (query) filter.title = { $regex: query, $options: "i" };

    try {
        const snippets = await SnippetModel.find(filter, {
            user: 0,
            updatedAt: 0,
            __v: 0,
        })
            .skip(skip)
            .limit(isNaN(limit) ? 10 : limit);

        const totalCount = await SnippetModel.countDocuments({
            user: userId,
        });
        const pagination = {
            has_next_page: totalCount > skip + snippets.length,
            current_page: page,
            current_count: snippets.length,
            total_count: totalCount,
            limit,
        };

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Snippets fetched successfully",
            pagination,
            data: snippets,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch Snippets",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Update a Snippet
export const updateSnippet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const snippetId = req.params.id;
    const { title, snippet } = req.body;

    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
        return next(createError("Snippet not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await SnippetModel.findOneAndUpdate(
            {
                _id: snippetId,
                user: userId,
            },
            { title, snippet }
        );

        if (!response) {
            return next(
                createError("Snippet not found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            StatusCodes: StatusCodes.OK,
            message: "Snippet updated Successfully",
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Update Snippet",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Delete a Snippet
export const deleteSnippet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.id;
    const snippetId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(snippetId)) {
        return next(createError("Snippet not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await SnippetModel.findOneAndDelete({
            _id: snippetId,
            user: userId,
        });

        if (!response) {
            return next(
                createError("Snippet not found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            StatusCodes: StatusCodes.OK,
            message: "Snippet deleted Successfully",
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Delete Snippet",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};
