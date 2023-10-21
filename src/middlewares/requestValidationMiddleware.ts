import { RequestHandler } from "express";
import { ZodError, ZodSchema } from "zod";

import { BadRequestError } from "@/models/errors";

export type RequestValidationSchemas<TParams, TQuery, TBody> = {
    params?: ZodSchema<TParams>;
    query?: ZodSchema<TQuery>;
    body?: ZodSchema<TBody>;
};

/**
 * Validate request params, query and body using zod schemas. Throw an invalid request error if the
 * request is invalid.
 * @param params - A zod schema represents the expected params schema.
 * @param query - A zod schema represents the expected query schema.
 * @param body - A zod schema represents the expected body schema.
 */
export const validateRequestMiddleware: <TParams, TQuery, TBody>(
    schemas: RequestValidationSchemas<TParams, TQuery, TBody>,
) => RequestHandler<TParams, unknown, TBody, TQuery> =
    ({ params, query, body }) =>
    (req, _, next) => {
        const zodErrors: ZodError[] = [];
        if (params) {
            const parsed = params.safeParse(req.params);
            if (!parsed.success) {
                zodErrors.push(parsed.error);
            } else {
                req.params = parsed.data;
            }
        }
        if (query) {
            const parsed = query.safeParse(req.query);
            if (!parsed.success) {
                zodErrors.push(parsed.error);
            } else {
                req.query = parsed.data;
            }
        }
        if (body) {
            const parsed = body.safeParse(req.body);
            if (!parsed.success) {
                zodErrors.push(parsed.error);
            } else {
                req.body = parsed.data;
            }
        }
        if (zodErrors.length > 0) {
            throw new BadRequestError(JSON.stringify(zodErrors, null, 2));
        }
        next();
    };
