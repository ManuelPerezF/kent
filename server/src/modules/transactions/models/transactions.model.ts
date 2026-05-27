import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const transactionTypeSchema = z.enum(["INGRESO", "GASTO"]);

export const createTransactionBodySchema = z
  .object({
    accountId: z.number().int().positive("La cuenta es obligatoria"),
    categoryId: z.number().int().positive("La categoría es obligatoria"),
    type: transactionTypeSchema,
    amount: z.number().positive("El importe debe ser mayor que 0"),
    occurredAt: z.coerce.date(),
    note: z.string().optional(),
    budgetId: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "INGRESO" && data.budgetId !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Un ingreso no puede ligarse a un presupuesto",
        path: ["budgetId"],
      });
    }
  });

export type CreateTransactionBody = z.infer<typeof createTransactionBodySchema>;

export const transactionSelectPublic = {
  id: true,
  userId: true,
  accountId: true,
  categoryId: true,
  budgetId: true,
  type: true,
  amount: true,
  occurredAt: true,
  note: true,
} as const;

export type Transaction = Prisma.TransactionGetPayload<{ select: typeof transactionSelectPublic }>;

export interface ListTransactionsQuery {
  budgetId?: number;
  type?: "INGRESO" | "GASTO";
  from?: Date;
  to?: Date;
}
