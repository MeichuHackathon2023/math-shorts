import { Router } from "express";
import { z } from "zod";

import { createRoute } from "@/utils/route";
import { tagSchema } from "@/models/tag";

export const tagRoute = {
    router: Router(),
    basePath: "/tag",
    tags: ["Tag"],
};

createRoute({
    ...tagRoute,
    method: "post",
    path: "/",
    summary: "新增 tag",
    needAuthenticated: false,

    schemas: {
        request: {
            body: z.object({
                name: z.string(),
            }),
        },
        response: tagSchema,
    },

    handler: async (req, res) => {
        const {
            body: { name },
            services: { tag: tagService },
        } = req;
        const newTag = await tagService.createTag({
            name
        });
        res.status(200).validateAndSend(newTag);
    },
});

createRoute({
    ...tagRoute,
    method: "get",
    path: "/",
    summary: "取得所有 tag",
    needAuthenticated: false,

    schemas: {
        request: {},
        response: z.array(tagSchema),
    },

    handler: async (req, res) => {
        const {
            services: { tag: tagService },
        } = req;
        const tags = await tagService.getTags();
        res.status(200).validateAndSend(tags);
    },
});