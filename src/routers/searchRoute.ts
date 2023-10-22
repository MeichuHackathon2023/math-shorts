import { Router } from "express";
import { z } from "zod";

import jwt from "jsonwebtoken";

import { createRoute } from "@/utils/route";
import { userSchema } from "@/models/user";
import { videoSchema } from "@/models/video";

import { Grade } from "@prisma/client";
import passport from "@/utils/passport";
import { ForbiddenError, UnauthorizedError } from "@/models/errors";
import { AuthenticateCallback } from "passport";
import { hashPassword } from "../utils/crypt";

const secretKey = process.env.JWT_TOKEN ?? "";

export const searchRoute = {
    router: Router(),
    basePath: "/search",
    tags: ["Search"],
};

createRoute({
    ...searchRoute,
    method: "get",
    path: "/",
    summary: "搜尋",
    needAuthenticated: false,

    schemas: {
        request: {
            query: z.object({
                keyword: z.string(),
                tags: z.string(),
            }),
        },
        response: z.array(videoSchema),
    },

    handler: async (req, res) => {
        const {
            query: { keyword, tags },
            services: { video: videoService },
        } = req;

        const response = await videoService.search({
            keyword,
            tags: tags.split(","),
        });

        res.status(200).validateAndSend(response);
    },
});
