import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

extendZodWithOpenApi(z);

const playProgressType = z.object({
    secondElapsed: z.number().openapi({ description: "觀看時間" }),
});

export const playProgressSchema = registry.register("PlayProgress", playProgressType);

export type PlayProgress = z.infer<typeof playProgressSchema>;
