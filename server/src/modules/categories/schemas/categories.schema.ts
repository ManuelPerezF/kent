import { z } from "zod";

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  color: z.string().optional(),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;