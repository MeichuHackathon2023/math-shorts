import { Router } from "express";

import { authRoute } from "@/routers/authRoute";
import { playProgressRoute } from "@/routers/playProgressRoute";
import { userRoute } from "./userRoute";
import { tagRoute } from "@/routers/tagRoute";
import { videoRoute } from "@/routers/videoRoute";
import { playlistRoute } from "@/routers/playlistRoute";
import { searchRoute } from "@/routers/searchRoute";
import { createRoute } from "@/utils/route";
import { z } from "zod";

const router = Router();

router.use(authRoute.basePath, authRoute.router);
router.use(playProgressRoute.basePath, playProgressRoute.router);
router.use(userRoute.basePath, userRoute.router);
router.use(tagRoute.basePath, tagRoute.router);
router.use(videoRoute.basePath, videoRoute.router);
router.use(playlistRoute.basePath, playlistRoute.router);
router.use(searchRoute.basePath, searchRoute.router)

// Health Check Endpoint

createRoute({
    router,
    basePath: "",
    method: "get",
    tags: ["General"],
    path: "/healthcheck",
    summary: "健康狀況",
    needAuthenticated: false,
    schemas: {
        request: {},
        response: z.object({
            health: z.boolean(),
        }),
    },
    handler: async (_, res) => {
        res.status(200).validateAndSend({
            health: true,
        });
    },
});

export default router;
