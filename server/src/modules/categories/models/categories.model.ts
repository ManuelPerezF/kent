import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  color: z.string().optional(),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const categorySelectPublic = { id: true, userId: true, name: true, color: true } as const;

export type Category = Prisma.CategoryGetPayload<{ select: typeof categorySelectPublic }>;
