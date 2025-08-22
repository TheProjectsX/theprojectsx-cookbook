import type { Request, Response, NextFunction } from "express";
import { createError } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { GuideModel } from "../models/guide.js";
import { CategoryModel } from "../models/category.js";

export const getNavigationRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await GuideModel.find(
            {},
            {
                _id: 0,
                category: 1,
                tag: 1,
            }
        );

        const navigationRoutes: { category: string; tags: string[] }[] = [];

        response.forEach((doc) => {
            const existing = navigationRoutes.find(
                (route) => route.category === doc.category
            );
            if (existing) {
                if (!existing.tags.includes(doc.tag)) {
                    existing.tags.push(doc.tag);
                }
            } else {
                navigationRoutes.push({
                    category: doc.category,
                    tags: [doc.tag],
                });
            }
        });

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Navigation Routes parsed",
            data: navigationRoutes,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Fetch navigation routes",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};

// Get Categories
export const getCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = CategoryModel.find();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Categories parsed",
            data: categories,
        });
    } catch (error: any) {
        next(
            createError(
                "Failed to Fetch categories data",
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            )
        );
    }
};
