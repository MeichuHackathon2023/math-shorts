import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

import { userSchema } from "./user";
import { videoSchema } from "./video";

extendZodWithOpenApi(z);

const playlistType = z.object({
    id: z.number(),
    name: z.string().openapi({ description: "播放清單名稱" }),
    description: z.string().openapi({ description: "播放清單描述" }),
    users: z.array(userSchema).openapi({ description: "使用者陣列" }),
    videos: z.array(videoSchema).openapi({ description: "影片陣列" }),
});

export const playlistSchema = registry.register("Playlist", playlistType);

export type Playlist = z.infer<typeof playlistSchema>;
