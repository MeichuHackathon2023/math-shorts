/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ZodRequestBody } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import { ZodObject, ZodSchema } from "zod";

export const registry = new OpenAPIRegistry();

// Register a route to api docs

// TODO: If the following codes are not used before going production, please delete them
// export function registerRouteToApiDocs(config: {
//     method: "get" | "post" | "put" | "delete" | "patch";
//     path: string;
//     summary?: string;
//     request?: {
//         body?: ZodSchema;
//         params?: ZodObject<any>;
//         query?: ZodObject<any>;
//     };
//     response: ZodSchema;
// }) {
//     const { method, path, summary, request, response } = config;
//     registry.registerPath({
//         method,
//         path,
//         summary,
//         request: request
//             ? {
//                 query: request.query,
//                 params: request.params,
//                 body: request.body
//                     ? ({
//                         content: { 'application/json': { schema: request.body } },
//                     } as ZodRequestBody)
//                     : undefined,
//             }
//             : undefined,
//         responses: {
//             200: {
//                 description: "",
//                 content: {
//                     "application/json": {
//                         schema: response,
//                     },
//                 },
//             },
//         },
//     });
// }
