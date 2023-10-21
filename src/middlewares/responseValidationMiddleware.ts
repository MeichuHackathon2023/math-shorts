import { RequestHandler } from "express";
import { ZodSchema } from "zod";

import { InternalServerError } from "@/models/errors";

/**
 * Validate whether the body of the response is in expected format by adding a function validateAndSend on the
 * express response object.
 * @param responseSchema - A zod schema using to validate the format of the response body.
 */
export const validateResponseMiddleware: <TResponse>(
    responseSchema: ZodSchema<TResponse>,
) => RequestHandler = (responseSchema) => (req, res, next) => {
    res.validateAndSend = (body: unknown) => {
        const parsed = responseSchema.safeParse(body);
        if (parsed.success) {
            return res.send(parsed.data);
        }
        console.error(parsed.error);
        throw new InternalServerError();
    };
    next();
};
