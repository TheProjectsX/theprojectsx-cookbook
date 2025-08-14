import type { Request, Response, NextFunction } from "express";
import { createError, genToken } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { GuideModel } from "../models/guide.js";
import { cookieOptions } from "../middlewares/auth.middleware.js";

// Login Admin (Uses .env credentials)
export const loginAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, password } = req.body;

    try {
        const matched =
            username &&
            password &&
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD;

        if (!matched)
            return next(
                createError("Invalid Credentials", StatusCodes.UNAUTHORIZED)
            );

        const userData = {
            username: "Admin",
            profilePicture: "https://i.ibb.co.com/LDCTnLbX/2.jpg",
        };

        const token = genToken({
            username: userData.username,
            role: "admin",
        });

        res.cookie("access_token", token, cookieOptions)
            .status(StatusCodes.OK)
            .json({
                success: true,
                statusCode: StatusCodes.OK,
                message: "Login Successful!",
                ...userData,
            });
    } catch (e) {
        const error = new Error("Failed to Login");
        next(error);
    }
};

/* Private */
export const logoutAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.clearCookie("access_token", cookieOptions).status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        message: "Logout Successful",
    });
};

// Create new Guide
export const createGuide = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { category, tag, title, content } = req.body;

    try {
        const targetGuide = await GuideModel.findOne({ category, tag });

        if (!targetGuide) {
            const categoryExists = await GuideModel.exists({ category });
            if (!categoryExists) {
                return next(
                    createError(
                        "Invalid Category provided",
                        StatusCodes.BAD_REQUEST,
                        `Category '${category}' doesn't exist`
                    )
                );
            }
        } else {
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
    const { category, tag, title, content } = req.body;
    const { id } = req.params;

    try {
        if ((category && !tag) || (!category && tag)) {
            return next(
                createError(
                    "Both 'category' and 'tag' required for one to be updated",
                    StatusCodes.BAD_REQUEST,
                    `${category || tag} provided but ${
                        !category ? "category" : "tag"
                    } missing`
                )
            );
        }

        if (category && tag) {
            const targetGuide = await GuideModel.findOne({ category, tag });

            if (!targetGuide) {
                const categoryExists = await GuideModel.exists({ category });
                if (!categoryExists) {
                    return next(
                        createError(
                            "Invalid Category provided",
                            StatusCodes.BAD_REQUEST,
                            `Category '${category}' doesn't exist`
                        )
                    );
                }
            } else {
                return next(
                    createError(
                        "Tag under Category already exists",
                        StatusCodes.BAD_REQUEST,
                        `Tag '${tag}' already exists under '${category}' Category`
                    )
                );
            }
        }

        const doc = {
            category,
            tag,
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
