import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const accountTypeSchema = z.enum(["EFECTIVO", "TARJETA"]);

export const createAccountBodySchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  type: accountTypeSchema,
  initialBalance: z.number().optional(),
});

export type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

export const accountSelectPublic = {
  id: true,
  userId: true,
  name: true,
  type: true,
  initialBalance: true,
} as const;

export type Account = Prisma.AccountGetPayload<{ select: typeof accountSelectPublic }>;

export type AccountWithBalance = Account & { balance: number };
