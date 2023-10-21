import crypto from "crypto";
import { RequestHandler } from "express";

const requestIdHeaderName = "X-Request-ID";

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
    const id = crypto.randomBytes(16).toString("hex");
    res.set(requestIdHeaderName, id);
    req.requestId = id;
    next();
};
