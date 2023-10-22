import { ErrorRequestHandler } from "express";

import { CustomError, InternalServerError } from "@/models/errors";
import logger from "@/utils/logger";

// Catch custom errors and send them back as the response
// If the error is not a custom error, treat it as internal server error
export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    logger.error({
        req: { id: req.requestId }, // 與 loggingMiddleware 使用一樣的格式儲存 request id
        error: err instanceof Error ? err.stack : err,
    });

    if (!(err instanceof CustomError)) {
        err = new InternalServerError();
    }
    const { message, code, statusCode } = err as CustomError;
    res.status(statusCode).send({
        success: false,
        error: { code, message, requestId: req.requestId },
    });
    next();
};
