/* eslint-disable @typescript-eslint/ban-ts-comment */
import { extendZodWithOpenApi } from "zod-to-openapi";
import { RequestHandler, Router } from "express";
import { z, ZodSchema } from "zod";

import { isAuthenticated } from "@/middlewares/authMiddleware";
import {
    RequestValidationSchemas,
    validateRequestMiddleware,
} from "@/middlewares/requestValidationMiddleware";
import { validateResponseMiddleware } from "@/middlewares/responseValidationMiddleware";
import { registry } from "@/utils/openApi";

/**
 * HTTP methods.
 */
type Method = "get" | "post" | "patch" | "delete" | "put";

interface CreateRouteProps<TParams, TQuery, TBody, TResponse> {
    /**
     * The express router to handle the route.
     */
    router: Router;

    /**
     * The base path, for registering api docs only by concatenating with path, defaults to "".
     * @example /auth
     */
    basePath?: string;

    /**
     * The path after base path, for registering express router and api docs, e.g. /login/email.
     * @example /login/email
     */
    path: string;

    /**
     * The HTTP method.
     */
    method: Method;

    /**
     * A brief description of the route to display on api docs.
     */
    summary?: string;

    /**
     * A full description of the route to display on api docs.
     */
    description?: string;

    /**
     * A list of tags to display on api docs.
     */
    tags?: string[];

    /**
     * If the request needs to be authenticated to access by checking the auth token on the header, defaults to true.
     * Notes: if true, it will be handled by isAuthenticated middleware.
     */
    needAuthenticated?: boolean;

    /**
     * Schemas to validate payload of request and response.
     * Notes: if not undefined, it will be handled by validateRequestMiddleware and validateResponseMiddleware.
     */
    schemas?: {
        request?: RequestValidationSchemas<TParams, TQuery, TBody>;
        response?: ZodSchema<TResponse>;
    };

    /**
     * The request handler.
     */
    handler?: RequestHandler<TParams, unknown, TBody, TQuery>;

    /**
     * Request handlers, used when executing multiple handlers sequentially for a single route.
     * Notes: either "handler" or "handlers" parameter should be defined
     */
    handlers?: RequestHandler<TParams, unknown, TBody, TQuery>[];
}


extendZodWithOpenApi(z);

/**
 * Create a route with handler, and register it to api docs by request and response schemas automatically.
 */
export function createRoute<TParams, TQuery, TBody, TResponse>({
    router,
    basePath = "",
    path,
    method,
    summary,
    description,
    tags,
    needAuthenticated = true,
    schemas,
    handler,
    handlers,
}: CreateRouteProps<TParams, TQuery, TBody, TResponse>) {
    const { request: requestSchema, response: responseSchema } = schemas || {};

    // Register the route to the api docs
    registry.registerPath({
        method,
        path: basePath + path,
        description: description ?? "",
        summary,
        tags,
        request: {
            // @ts-ignore
            query: requestSchema?.query,
            // @ts-ignore
            params: requestSchema?.params,
            body: requestSchema?.body
                ? { content: { 'application/json': { schema: requestSchema?.body } } }
                : undefined,
        },
        responses: {
            200: {
                description: "",
                content: {
                    "application/json": {
                        schema: (responseSchema ?? z.object({})).openapi({
                            description: "",
                        }),
                    },
                },
            },
        },
    });

    // Check if the request is authenticated
    if (needAuthenticated) {
        router[method]?.(path, isAuthenticated);
    }

    // Validate the request format
    if (requestSchema) {
        router[method]?.(path, validateRequestMiddleware(requestSchema));
    }

    // Validate the response format
    if (responseSchema) {
        router[method]?.(path, validateResponseMiddleware(responseSchema));
    }

    // Handle the route with handler
    if (handler) {
        router[method]?.(path, handler);
    } else if (handlers) {
        router[method]?.(path, ...handlers);
    } else {
        throw new Error("Need at least one request handler");
    }
}
