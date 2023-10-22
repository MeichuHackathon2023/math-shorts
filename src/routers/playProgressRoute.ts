import { Router } from "express";
import { z } from "zod";
import { NotFoundError, InternalServerError } from "@/models/errors";


import { createRoute } from "@/utils/route";
import { playProgressSchema } from "@/models/playProgress"; 

export const playProgressRoute = {
    router: Router(),
    basePath: "/user/video",
    tags: ["PlayProgress"],
};

createRoute({
    ...playProgressRoute,
    method: "get",
    path: '/:id/progress',
    summary: "取得自己的觀看進度",
    needAuthenticated: true, 
    schemas: {
        request: {
            params: z.object({
                id: z.string()
            })
        },
        response: z.object({
            percentageElapsed: z.number(),
        }), 
    },
  
    handler: async (req, res) => {
        const { 
            params: { id },
            user,
            services: { playProgress: playProgressService },
        } = req;        

        if (user == null) {
            throw new InternalServerError();
        }
        const userId = user.id;
        
        const playProgress = await playProgressService.getPlayProgress({ userId, videoId: parseInt(id) });

        if (playProgress == null) {
            throw new NotFoundError()
        }
        
        res.status(200).validateAndSend({ percentageElapsed: playProgress.percentageElapsed });
    },
});

createRoute({
    ...playProgressRoute,
    method: "put",
    path: '/:id/progress',
    summary: "更新自己的觀看進度",
    needAuthenticated: true, 
  
    schemas: {
        request: {
            params: z.object({
                id: z.string(),
            }),
            body: z.object({
                percentageElapsed: z.number(),
            }),
        },
        response: z.object({}),
    },
  
    handler: async (req, res) => {
        const { 
            params: { id },
            body: { percentageElapsed },
            user,
            services: { playProgress: playProgressService },
        } = req;   
        
        if (user == null) {
            throw new InternalServerError();
        }
        const userId = user.id;
        
        await playProgressService.updateOrCreatePlayProgress({ userId, videoId: parseInt(id), percentageElapsed });
        
        res.status(200).validateAndSend({});
    },
});