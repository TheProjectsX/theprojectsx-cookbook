import type { Request, Response, NextFunction } from "express";
import { createError } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { GuideModel } from "../models/guide.js";
import { CategoryModel } from "../models/category.js";

// Create new Guide
export const createGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, tag, title, content } = req.body;

    try {
        const targetCategory = await CategoryModel.findOne({ name: category });

        if (!targetCategory) {
            return next(
                createError(
                    "Invalid Category provided",
                    StatusCodes.BAD_REQUEST,
                    `Category '${category}' doesn't exist`
                )
            );
        } else if (targetCategory.tags.includes(tag)) {
            return next(
                createError(
                    "Tag under Category already exists",
                    StatusCodes.BAD_REQUEST,
                    `Tag '${tag}' already exists under '${category}' Category`
                )
            );
        }

        const doc = {
            category,
            tag,
            title,
            content,
        };

        const newGuide = new GuideModel(doc);
        const response = await newGuide.save();

        await CategoryModel.findOneAndUpdate(
            { name: category },
            {
                $push: {
                    tags: tag,
                },
            }
        );

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "New Guide Created Successfully",
            id: response._id,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Create Guide",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Update Guide
export const updateGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, content } = req.body;
    const { id } = req.params;

    try {
        const doc = {
            title,
            content,
        };

        const response = await GuideModel.findByIdAndUpdate(id, doc);
        if (!response) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Guide Updated Successfully",
            id: response._id,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Update Guide",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Delete Guide
export const deleteGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const response = await GuideModel.findByIdAndDelete(id);
        if (!response) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        await CategoryModel.findOneAndUpdate(
            { name: response.category },
            {
                $pull: {
                    tags: response.tag,
                },
            }
        );

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Guide Deleted Successfully",
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Delete Guide",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Create Category
export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name } = req.body;

    try {
        const newCategory = new CategoryModel({ name });
        const response = await newCategory.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Category Created Successfully",
            id: response._id,
            name: response.name,
        });
    } catch (error: any) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            next(
                createError(
                    "Failed to Create Category",
                    StatusCodes.BAD_REQUEST,
                    `${field} already exists`
                )
            );
        } else {
            next(createError("Failed to Create Category"));
        }
    }
};

// Update Category
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name } = req.body;
    const { id } = req.params;

    try {
        const response = await CategoryModel.findByIdAndUpdate(id, { name });
        if (!response) {
            return next(
                createError("Category not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Category Updated Successfully",
            id: response._id,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Update Category",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Delete Category
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    try {
        const response = await CategoryModel.findByIdAndDelete(id);
        if (!response) {
            return next(
                createError("Category not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Category Deleted Successfully",
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Delete Category",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};
