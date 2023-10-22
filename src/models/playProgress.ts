import { extendZodWithOpenApi } from "zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

extendZodWithOpenApi(z);

const playProgressType = z.object({
    percentageElapsed: z.number().openapi({ description: "觀看時間比例" }),
});

export const playProgressSchema = registry.register("PlayProgress", playProgressType);

export type PlayProgress = z.infer<typeof playProgressSchema>;
