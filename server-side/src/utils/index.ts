import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const genHash = (data: string) => bcrypt.hashSync(data, 10);

export const hashMatched = (data: string, encrypted: string) =>
    bcrypt.compareSync(data, encrypted);

export const genToken = (payload: any) =>
    jwt.sign(payload, process.env.JWT_SECRET || "", { expiresIn: "7d" });

export const verifyToken = (token: string) =>
    jwt.verify(token, process.env.JWT_SECRET || "");

export const createError = (
    message: string = "Internal Server Error",
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    error?: any
) => {
    const errorObj = new Error(message) as Error & {
        statusCode?: number;
        error?: any;
    };
    errorObj.statusCode = statusCode;
    errorObj.error = error;

    return errorObj;
};
