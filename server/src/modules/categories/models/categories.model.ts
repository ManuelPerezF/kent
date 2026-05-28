import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const categoryTypeSchema = z.enum(["INGRESO", "GASTO"]);

export const createCategoryBodySchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio"),
    kind: categoryTypeSchema.default("GASTO"),
    color: z.string().optional(),
    monthlyLimit: z.number().positive("El límite mensual debe ser mayor que 0").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "INGRESO" && data.monthlyLimit !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Una categoría de ingreso no usa límite mensual",
        path: ["monthlyLimit"],
      });
    }
  });

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const categorySelectPublic = {
  id: true,
  userId: true,
  name: true,
  kind: true,
  color: true,
  monthlyLimit: true,
} as const;

export type Category = Prisma.CategoryGetPayload<{ select: typeof categorySelectPublic }>;
