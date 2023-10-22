import { Router } from "express";
import { z } from "zod";
import { NotFoundError, InternalServerError } from "@/models/errors";

import { createRoute } from "@/utils/route";
import { playlistSchema, playlistUserInputSchema } from "@/models/playlist";
import { ZodLazy } from "zod";

export const playlistRoute = {
    router: Router(),
    basePath: "/user/playlist",
    tags: ["Playlist"],
};

createRoute({
    ...playlistRoute,
    method: "get",
    path: "/",
    summary: "取得自己的播放清單",
    needAuthenticated: true,
    schemas: {
        request: {},
        response: z.array(playlistSchema),
    },

    handler: async (req, res) => {
        const {
            user,
            services: { playlist: playlistService },
        } = req;

        if (user == null) {
            console.log("here");
            throw new InternalServerError();
        }
        const userId = user.id;

        const playlists = await playlistService.getPlaylists({ userId });

        res.status(200).validateAndSend(playlists);
    },
});

createRoute({
    ...playlistRoute,
    method: "put",
    path: "/",
    summary: "建立/更新自己的播放清單",
    needAuthenticated: true,

    schemas: {
        request: {
            body: playlistUserInputSchema,
        },
        response: playlistSchema,
    },

    handler: async (req, res) => {
        const {
            body: playlist,
            services: { playlist: playlistService },
        } = req;

        const newPlaylist = await playlistService.updateOrCreatePlaylist(
            playlist,
        );

        res.status(200).validateAndSend(newPlaylist);
    },
});
