import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const createBudgetBodySchema = z
  .object({
    amount: z.number().positive("El monto debe ser mayor que 0"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha fin debe ser posterior o igual a la fecha inicio",
        path: ["endDate"],
      });
    }
  });

export type CreateBudgetBody = z.infer<typeof createBudgetBodySchema>;

export const budgetSelectPublic = {
  id: true,
  userId: true,
  amount: true,
  startDate: true,
  endDate: true,
} as const;

export type Budget = Prisma.BudgetGetPayload<{ select: typeof budgetSelectPublic }>;
