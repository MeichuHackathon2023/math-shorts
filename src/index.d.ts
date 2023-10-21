import studentSchema from "@/models/student";
import userSchema from "@models/user";
import applicationSchema from "@/models/application";
import commentSchema from "@/models/comment";
import templateSchema from "@/models/template";

import flashcardProgressService from "./services/flashcardProgressService";
import playlistService from "./services/playlistService";
import playProgressService from "./services/playProgressService";
import tagService from "./services/tagService";
import userService from "./services/userService";
import videoService from "./services/videoService";

import type { Role } from "@/models/role";
import siteInfoService from "./services/siteInfoService";

declare global {
    namespace Express {
        export interface Request {
            services: {
                flashcardProgress: typeof flashcardProgressService;
                playlist: typeof playlistService;
                playProgress: typeof playProgressService;
                tag: typeof tagService;
                user: typeof userService;
                video: typeof videoService;
            };
            requestId: string;
        }
        interface User {
            id: number;
            email: string;
            name: string;
            grade: string;
        }
        export interface Response {
            /**
             * A custom function to verify response payload, which is attached by validateResponse middleware.
             */
            validateAndSend: Send;
        }
    }
}
