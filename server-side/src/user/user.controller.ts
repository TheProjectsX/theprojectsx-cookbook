import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { createError } from "../utils/index.js";
import { SnippetModel } from "../models/snippet.js";
import mongoose from "mongoose";

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
            message: "Categories parsed successfully",
            data: categories,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to get Categories",
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

    try {
        const snippets = await SnippetModel.find({
            user: userId,
            category,
            title: { $regex: `^${query}$`, $options: "i" },
        })
            .skip(skip)
            .limit(isNaN(limit) ? 10 : limit);

        const totalCount = await SnippetModel.estimatedDocumentCount({
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
            message: "Snippets parsed successfully",
            pagination,
            data: snippets,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to get Snippets",
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
        return next(
            createError("Validation error occurred.", StatusCodes.BAD_REQUEST, {
                field: "id",
                message: "Invalid snippet ID provided",
            })
        );
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
        return next(
            createError("Validation error occurred.", StatusCodes.BAD_REQUEST, {
                field: "id",
                message: "Invalid snippet ID provided",
            })
        );
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
