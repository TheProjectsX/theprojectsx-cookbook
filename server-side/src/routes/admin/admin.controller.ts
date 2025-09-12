import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { createError } from "../../utils/index.js";
import { GuideModel } from "../../models/guide.js";
import { CategoryModel } from "../../models/category.js";
import { SectionModel } from "../../models/section.js";
import mongoose from "mongoose";
import { AvatarModel } from "../../models/avatars.js";
import {
    getCountOverviewPipeline,
    getGuideByCatPipeline,
    getUsersPipeline,
} from "../../db/pipelines.js";
import { UserModel } from "../../models/user.js";

// -------- Statistics --------

// Get Statistics
export const getStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [overview, guidesByCategory, latestGuides] = await Promise.all([
            GuideModel.aggregate(getCountOverviewPipeline()),
            GuideModel.aggregate(getGuideByCatPipeline()),
            GuideModel.find({}, { title: 1, category: 1, tag: 1 })
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        const countOverview = {
            guides: overview[0]?.guides[0]?.count || 0,
            categories: overview[0]?.sections[0]?.count || 0,
            sections: overview[0]?.sections[0]?.count || 0,
            snippets: overview[0]?.snippets[0]?.count || 0,
            users: overview[0]?.users[0]?.count || 0,
        };

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Data fetched Successfully",
            countOverview,
            guidesByCategory,
            latestGuides,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch Data",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// -------- Category --------

// Create Category
export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body?.name) {
        return next(
            createError("Invalid Body Provided", StatusCodes.BAD_REQUEST)
        );
    }

    const { name } = req.body;

    try {
        const newCategory = new CategoryModel({ name });
        const response = await newCategory.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            statusCode: StatusCodes.CREATED,
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

// Get Categories
export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await CategoryModel.find();

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Categories fetched successfully",
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

// Update Category
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body?.name) {
        return next(
            createError("Invalid Body Provided", StatusCodes.BAD_REQUEST)
        );
    }

    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Category not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await CategoryModel.findByIdAndUpdate(id, { name });
        if (!response) {
            return next(
                createError("Category not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Category not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await CategoryModel.findByIdAndDelete(id);
        if (!response) {
            return next(
                createError("Category not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
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

// -------- Guide --------

// Create new Guide
export const createGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, tag, title } = req.body;

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
            statusCode: StatusCodes.CREATED,
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

// Get single Guide
export const getGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const guide = await GuideModel.findById(id);

        if (!guide) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Guides fetched successfully",
            ...guide.toObject(),
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to get Guides",
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
    const { id } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const doc = {
            title,
        };

        const response = await GuideModel.findByIdAndUpdate(id, doc);
        if (!response) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await GuideModel.findByIdAndDelete(id);
        if (!response) {
            return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
        }

        // Remove the tag from `Category` table
        await CategoryModel.findOneAndUpdate(
            { name: response.category },
            {
                $pull: {
                    tags: response.tag,
                },
            }
        );

        // Delete all Section data
        await SectionModel.deleteMany({ _id: { $in: response.sections } });

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
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

// -------- Sections --------

// Create Section
export const createSection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const guideId = req.params.id;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(guideId)) {
        return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const doc = { title, content };
        const newSection = new SectionModel(doc);
        const response = await newSection.save();

        await GuideModel.findByIdAndUpdate(guideId, {
            $push: { sections: response._id },
        });

        res.status(StatusCodes.CREATED).json({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "New Section Created Successfully",
            id: response._id,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Create Section",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Get single Guide
export const getSection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Section not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const guide = await SectionModel.findById(id);

        if (!guide) {
            return next(
                createError("Section not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Section fetched successfully",
            ...guide.toObject(),
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to get Section",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Update Section
export const updateSection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const doc = { title, content };
        const response = await SectionModel.findByIdAndUpdate(id, doc);

        if (!response) {
            return next(
                createError("Section not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Section Updated Successfully",
            id: response._id,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Update Section",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Delete Section
export const deleteSection = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Guide not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await SectionModel.findByIdAndDelete(id);
        if (!response) {
            return next(
                createError("Section not Found", StatusCodes.NOT_FOUND)
            );
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Section Deleted Successfully",
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Delete Section",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// -------- Avatars --------

// Create Avatar
export const createAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { url, name } = req.body;

    try {
        const newAvatar = new AvatarModel({ url, name });
        const response = await newAvatar.save();

        res.status(StatusCodes.CREATED).json({
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "New Avatar Added",
            ...response.toObject(),
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to insert Avatar",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Update Avatar
export const updateAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { url, name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Avatar not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await AvatarModel.findByIdAndUpdate(id, { url, name });

        if (!response) {
            return next(createError("Avatar not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Avatar Updated Successfully",
            ...response.toObject(),
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to update Avatar",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Delete Avatar
export const deleteAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Avatar not Found", StatusCodes.NOT_FOUND));
    }

    try {
        const response = await AvatarModel.findByIdAndDelete(id);
        if (!response) {
            return next(createError("Avatar not Found", StatusCodes.NOT_FOUND));
        }

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Avatar Deleted Successfully",
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Delete Avatar",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// -------- Users --------
export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await UserModel.aggregate(getUsersPipeline());
        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Users Fetched Successfully",
            data: response,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to fetch Users",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};
