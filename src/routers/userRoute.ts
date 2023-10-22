import { Router } from "express";
import { z } from "zod";
import { InternalServerError, NotFoundError } from "@/models/errors";

import { createRoute } from "@/utils/route";
import { userSchema } from "@/models/user";
import { Grade } from "@prisma/client";
import { VideoStatus, videoSchema } from "@/models/video";

export const userRoute = {
    router: Router(),
    basePath: "/user",
    tags: ["User"],
};

createRoute({
    ...userRoute,
    method: "get",
    path: "/me",
    summary: "取得自己的資料",
    needAuthenticated: true,
    schemas: {
        request: {},
        response: userSchema,
    },

    handler: async (req, res) => {
        const {
            user,
            services: { user: userService },
        } = req;

        if (!user) throw new InternalServerError();

        const me = await userService.getUser({
            userId: user.id,
        });

        if (!me) throw new InternalServerError();
        const { id, name, grade } = me;

        res.status(200).validateAndSend({ id, name, grade });
    },
});
createRoute({
    ...userRoute,
    method: "get",
    path: "/video",
    summary: "取得自己上傳的影片",
    needAuthenticated: true,
    schemas: {
        request: {},
        response: z.array(videoSchema),
    },

    handler: async (req, res) => {
        const {
            user,
            services: { user: userService, video: videoService },
        } = req;

        if (!user) throw new InternalServerError();

        const me = await userService.getUser({
            userId: user.id,
        });

        if (!me) throw new InternalServerError();
        const { videos } = me;

        res.status(200).validateAndSend(
            await Promise.all(
                videos.map(({ id }) => {
                    return videoService.getVideo({ videoId: id });
                }),
            ),
        );
    },
});

createRoute({
    ...userRoute,
    method: "get",
    path: "/video/:id/status",
    summary: "取得自己上傳影片的轉檔進度",
    needAuthenticated: true,
    schemas: {
        request: { params: z.object({ id: z.string() }) },
        response: z.nativeEnum(VideoStatus),
    },

    handler: async (req, res) => {
        const {
            user,
            params: { id: videoId },
            services: { video: videoService },
        } = req;

        if (!user) throw new InternalServerError();

        const status = await videoService.checkVideoStatus({
            videoId: parseInt(videoId),
        });

        res.status(200).validateAndSend(status);
    },
});
