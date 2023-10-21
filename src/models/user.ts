import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

import { videoSchema, Video } from "./video";

extendZodWithOpenApi(z);

const baseUserType = z.object({
    id: z.number(),
    name: z.string().openapi({ description: "使用者名稱" }),
    grade: z.string().openapi({ description: "年級" }),
});

export type User = z.infer<typeof baseUserType> & {
    videos: Video[];
};

const userType: z.ZodType<User> = baseUserType.extend({
    videos: z.lazy(() => videoSchema.array()).openapi({description: '使用者上傳的影片'}),
});

export const userSchema = registry.register("User", userType);
