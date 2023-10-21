import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

import { userSchema, User } from "./user";
import { tagSchema } from "./tag";

extendZodWithOpenApi(z);

const baseVideoType = z.object({
    id: z.number(),
    name: z.string().openapi({ description: "影片名稱" }),
    description: z.string().openapi({ description: "影片描述" }),
    embedUrl: z.string().openapi({ description: "影片嵌入網址" }),
    tags: z.array(tagSchema),
});

export type Video = z.infer<typeof baseVideoType> & {
    user: User;
};

const videoType: z.ZodType<Video> = baseVideoType.extend({
    user: z.lazy(() => userSchema).openapi({description: '上傳此影片的使用者'}),
});

export const videoSchema = registry.register("Video", videoType);

