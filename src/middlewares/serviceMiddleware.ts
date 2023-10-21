import { RequestHandler } from "express";

import flashcardProgressService from "@/services/flashcardProgressService";
import playlistService from "@/services/playlistService";
import playProgressService from "@/services/playProgressService";
import tagService from "@/services/tagService";
import userService from "@/services/userService";
import videoService from "@/services/videoService";

// Inject services into request
export const serviceMiddleware: RequestHandler = (req, _, next) => {
    req.services = {
        flashcardProgress: flashcardProgressService,
        playlist: playlistService,
        playProgress: playProgressService,
        tag: tagService,
        user: userService,
        video: videoService,
    };
    next();
};
