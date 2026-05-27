import { z } from "zod";
import { Prisma } from "../../../prisma/client/client.js";

export const createSubscriptionBodySchema = z.object({
  accountId: z.number().int().positive("La cuenta es obligatoria"),
  categoryId: z.number().int().positive("La categoría es obligatoria"),
  name: z.string().min(1, "El nombre es obligatorio"),
  amount: z.number().positive("El importe debe ser mayor que 0"),
  nextBillingDate: z.coerce.date(),
  active: z.boolean().optional(),
});

export type CreateSubscriptionBody = z.infer<typeof createSubscriptionBodySchema>;

export const subscriptionSelectPublic = {
  id: true,
  userId: true,
  accountId: true,
  categoryId: true,
  name: true,
  amount: true,
  nextBillingDate: true,
  active: true,
} as const;

export type Subscription = Prisma.SubscriptionGetPayload<{ select: typeof subscriptionSelectPublic }>;

export interface UpcomingSubscription {
  id: number;
  name: string;
  amount: number;
  nextBillingDate: Date;
  accountId: number;
  accountName: string;
}

export interface ListUpcomingQuery {
  from?: unknown;
  to?: unknown;
  limit?: number;
}
