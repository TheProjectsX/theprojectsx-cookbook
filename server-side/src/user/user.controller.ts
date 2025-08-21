import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "../models/user.js";
import { createError, genHash, genToken, hashMatched } from "../utils/index.js";
import { cookieOptions } from "../middlewares/auth.middleware.js";
import { SnippetModel } from "../models/snippet.js";
import mongoose from "mongoose";

// Register New User (Public)
export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const body = req.body;

    const hashedPassword = genHash(body.password);
    const doc = {
        name: body.name,
        email: body.email,
        password: hashedPassword,
    };

    try {
        const newUser = new UserModel(doc);
        const response = (await newUser.save()).toObject();

        const { password: _, ...userData } = response;

        const token = genToken({
            id: userData._id,
            email: userData.email,
            role: userData.role,
        });

        res.cookie("access_token", token, cookieOptions)
            .status(StatusCodes.CREATED)
            .json({
                success: true,
                statusCode: StatusCodes.CREATED,
                message: "Registration Successful!",
                ...userData,
            });
    } catch (e) {
        const error = new Error("Failed to Create Account");
        next(error);
    }
};

// Login User (Public)
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    try {
        const targetUser = await UserModel.findOne({ email });
        if (!targetUser)
            return next(
                createError("Invalid Credentials", StatusCodes.UNAUTHORIZED)
            );

        const matched = hashMatched(password, targetUser.password);
        if (!matched)
            return next(
                createError("Invalid Credentials", StatusCodes.UNAUTHORIZED)
            );

        const { password: _, ...userData } = targetUser.toObject();

        const token = genToken({
            id: userData._id,
            email: userData.email,
            role: userData.role,
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

// Logout User (Private)
export const logoutUser = async (
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

    try {
        const snippets = await SnippetModel.find({ user: userId });

        res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: "Snippets parsed successfully",
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
                id: snippetId,
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
            id: snippetId,
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
