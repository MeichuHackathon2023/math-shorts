import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import {
    BadRequestError,
    InternalServerError,
    RequestEntityTooLargeError,
} from "@/models/errors";
import axios from "../utils/axios";
import originalAxios from "axios";
import { registry } from "@/utils/openApi";

import { createRoute } from "@/utils/route";
import { videoSchema } from "@/models/video";
import { isAuthenticated } from "@/middlewares/authMiddleware";
import { validateRequestMiddleware } from "@/middlewares/requestValidationMiddleware";
import { validateResponseMiddleware } from "@/middlewares/responseValidationMiddleware";
import path from "path";
import { string } from "zod";
import videoService from "@/services/videoService";
import playProgressService from "@/services/playProgressService";

const router = Router();

const maxSize = 100 * 1024 * 1024; // 100MB as limit

export const videoRoute = {
    router,
    basePath: "/video",
    tags: ["Video"],
};

const extensionAllowed = [
    ".avi",
    ".mpg",
    ".mp4",
    ".ts",
    ".m2ts",
    ".mov",
    ".mkv",
    ".wmv",
    ".bdav",
];

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (!extensionAllowed.includes(ext)) {
            return callback(
                new BadRequestError(
                    `Only ${extensionAllowed.join(", ")} are allowed`,
                ),
            );
        }
        callback(null, true);
    },
    limits: { fileSize: maxSize },
});

createRoute({
    ...videoRoute,
    method: "get",
    path: "/:id",
    summary: "取得單一 video",
    needAuthenticated: false,

    schemas: {
        request: {
            params: z.object({
                id: z.string(),
            }),
        },
        response: videoSchema,
    },

    handler: async (req, res) => {
        const {
            params: { id },
            services: { video: videoService },
        } = req;
        const video = await videoService.getVideo({ videoId: parseInt(id) });
        res.status(200).validateAndSend(video);
    },
});

createRoute({
    ...videoRoute,
    method: "get",
    path: "/",
    summary: "取得推薦影片",
    needAuthenticated: true,

    schemas: {
        request: {},
        response: z.array(videoSchema)
    },

    handler: async (req, res) => {
        const {
            user,
            services: { video: videoService },
        } = req;

        const videos = await videoService.getAllVideo();
        const array = Array.from({ length: videos.length }, (_, k) => k);
        const shuffled = array.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, 10);

        if (!user) throw new InternalServerError()

        // TODO: recommend engine
        const myList = playProgressService.getPlayProgressDataForRec(user.id);
        const { spawn } = require("child_process");
        const python = spawn('python',["script.py", JSON.stringify(myList)]);

        console.log(python)

        res.status(200).validateAndSend(
            videos.filter((_, index) => selected.includes(index)),
        );
    },
});

const uploadRequestSchema = {
    query: z.object({
        name: z.string(),
        description: z.string(),
        tags: z.string(),
    }),
};
const uploadResponseSchema = z.object({
    video: videoSchema,
});

registry.registerPath({
    method: "post",
    path: videoRoute.basePath + "/",
    summary: "上傳影片",
    tags: videoRoute.tags,
    request: {
        query: uploadRequestSchema.query,
        body: {
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            file: { type: "string", format: "binary" },
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "",
            content: {
                "application/json": {
                    schema: uploadResponseSchema,
                },
            },
        },
    },
});

router["post"]?.(
    "/",
    isAuthenticated,
    validateRequestMiddleware(uploadRequestSchema),
    validateResponseMiddleware(uploadResponseSchema),
    async (req, res, next) => {
        const {
            query: { tags },
            services: { tag: tagService },
        } = req;

        const existingTags = new Set(
            (await tagService.getTags()).map(({ name }) => name),
        );
        const isTagValid =
            tags.trim() == "" ||
            tags.split(",").every((tag) => existingTags.has(tag));

        if (!isTagValid) {
            throw new BadRequestError("tag does not exist");
        }
        next();
    },
    (req, res, next) => {
        upload.single("file")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                next(new RequestEntityTooLargeError());
            } else if (err) {
                next(new InternalServerError());
            } else next();
        });
    },
    async (req, res) => {
        const {
            file,
            query: { name, description, tags },
            services: { video: videoService },
            user,
        } = req;
        if (!file) throw new InternalServerError();

        if (!user) {
            throw new InternalServerError();
        }

        const video = await videoService.createVideo({
            name,
            userId: user.id,
            description,
            tags,
            file,
        });

        res.status(200).validateAndSend({ video });
    },
);
