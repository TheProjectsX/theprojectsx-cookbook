import type { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.js";
import { createError, genHash, genToken, hashMatched } from "../utils/index.js";
import { cookieOptions } from "../middlewares/auth.middleware.js";
import { StatusCodes } from "http-status-codes";

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
    } catch (error: any) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            next(
                createError(
                    "Failed to Create Account",
                    StatusCodes.BAD_REQUEST,
                    `${field} already exists`
                )
            );
        } else {
            next(createError("Failed to Create Account"));
        }
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
