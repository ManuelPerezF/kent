import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const categoryTypeSchema = z.enum(["INGRESO", "GASTO"]);

export const createCategoryBodySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  kind: categoryTypeSchema.default("GASTO"),
  color: z.string().optional(),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const categorySelectPublic = {
  id: true,
  userId: true,
  name: true,
  kind: true,
  color: true,
} as const;

export type Category = Prisma.CategoryGetPayload<{ select: typeof categorySelectPublic }>;
