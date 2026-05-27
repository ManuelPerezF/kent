import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  color: z.string().optional(),
  monthlyLimit: z.number().positive("El límite mensual debe ser mayor que 0").optional(),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const categorySelectPublic = {
  id: true,
  userId: true,
  name: true,
  color: true,
  monthlyLimit: true,
} as const;

export type Category = Prisma.CategoryGetPayload<{ select: typeof categorySelectPublic }>;
