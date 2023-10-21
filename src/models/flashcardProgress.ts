import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

import { videoSchema } from "./video";

extendZodWithOpenApi(z);

const flashcardProgressType = z.object({
    hidden: z.array(videoSchema.pick({ id: true }))
});

export const flashcardProgressSchema = registry.register("FlashcardProgress", flashcardProgressType);

export type FlashcardProgress = z.infer<typeof flashcardProgressSchema>;
