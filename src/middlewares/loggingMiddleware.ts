import { RequestHandler } from "express";

import logger from "@/utils/logger";

export const loggingMiddleware: RequestHandler = (req, res, next) => {
    res.on("finish", () => {
        logger.info({
            req: {
                id: req.requestId,
                ip: req.ip,
                method: req.method,
                userId: req.user?.id,
                url: req.url,
                // body: req.body, // TODO: re-enable and redact secret
                params: req.params,
                query: req.query,
            },
            res: {
                statusCode: res.statusCode,
            },
        });
        // logger.info(req.method + " " + req.path  + " #" + req.requestId);
    });
    next();
};
