import { extendZodWithOpenApi } from "zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

import { userSchema, User } from "./user";
import { tagSchema } from "./tag";

extendZodWithOpenApi(z);

const videoIdType = z.number();

const videoIdOnlyType = z.object({
    id: videoIdType,
});

const baseVideoType = z.object({
    id: videoIdType,
    name: z.string().openapi({ description: "影片名稱" }),
    description: z.string().openapi({ description: "影片描述" }),
    embedLink: z.string().openapi({ description: "影片嵌入網址" }),
    duration: z.number().openapi({ description: "影片時長" }),
    tags: z.array(tagSchema),
});

export type Video = z.infer<typeof baseVideoType> & {
    user?: User;
};

const videoType: z.ZodType<Video> = baseVideoType.extend({
    user: z
        .lazy(() => userSchema)
        .optional()
        .openapi({ description: "上傳此影片的使用者" }),
});

export const videoSchema = registry.register("Video", videoType);

export const videoIdOnlySchema = registry.register(
    "VideoIdOnly",
    videoIdOnlyType,
);
export type VideoIdOnly = z.infer<typeof videoIdOnlySchema>;

export enum VideoStatus {
    VOD_STATUS_UNSPECIFIED = "VOD_STATUS_UNSPECIFIED",
    VOD_STATUS_CREATED = "VOD_STATUS_CREATED",
    VOD_STATUS_INGESTED = "VOD_STATUS_INGESTED",
    VOD_STATUS_QUEUED = "VOD_STATUS_QUEUED",
    VOD_STATUS_ENCODED = "VOD_STATUS_ENCODED",
    VOD_STATUS_DEPLOYED = "VOD_STATUS_DEPLOYED",
    VOD_STATUS_SUCCEEDED = "VOD_STATUS_SUCCEEDED",
}
