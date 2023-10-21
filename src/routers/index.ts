import { Router } from "express";

import { authRoute } from "@/routers/authRoute";
import { createRoute } from "@/utils/route";
import { z } from "zod";

const router = Router();

router.use(authRoute.basePath, authRoute.router);

// Health Check Endpoint

createRoute({
    router,
    basePath: "",
    method: "get",
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
