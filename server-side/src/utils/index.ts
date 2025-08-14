export const createError = (
    message: string,
    statusCode?: number,
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
