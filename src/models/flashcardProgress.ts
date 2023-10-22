import { extendZodWithOpenApi } from "zod-to-openapi";
import { z } from "zod";

import { registry } from "@/utils/openApi";

import { videoIdOnlySchema } from "./video";

extendZodWithOpenApi(z);

const flashcardProgressType = z.object({
    hidden: z.array(videoIdOnlySchema),
});

export const flashcardProgressSchema = registry.register(
    "FlashcardProgress",
    flashcardProgressType,
);

export type FlashcardProgress = z.infer<typeof flashcardProgressSchema>;
