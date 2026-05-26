import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const accountTypeSchema = z.enum(["EFECTIVO", "TARJETA"]);

export const createAccountBodySchema = z.object({
  type: accountTypeSchema,
  initialBalance: z.number().optional(),
});

export type CreateAccountBody = z.infer<typeof createAccountBodySchema>;

export const accountSelectPublic = { id: true, type: true, initialBalance: true } as const;

export type Account = Prisma.AccountGetPayload<{ select: typeof accountSelectPublic }>;
