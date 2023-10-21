import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

extendZodWithOpenApi(z);

const tagType = z.object({
    id: z.number(),
    name: z.string().openapi({ description: "標籤名稱" }),
});

export const tagSchema = registry.register("Tag", tagType);

export type Tag = z.infer<typeof tagSchema>;
