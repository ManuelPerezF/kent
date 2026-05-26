import {
  InternalServerError,
  NotFoundError,
} from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import {
  subscriptionSelectPublic,
  type CreateSubscriptionBody,
  type Subscription,
} from "../models/subscriptions.model.js";


export const subscriptionsService = {
  async list(userId: number): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: { userId },
      select: subscriptionSelectPublic,
      orderBy: { nextBillingDate: "asc" },
    });
  },

  async create(userId: number, data: CreateSubscriptionBody): Promise<Subscription> {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundError("Categoría no encontrada");
    }

    const account = await prisma.account.findUnique({
      where: { id: data.accountId },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundError("Cuenta no encontrada");
    }

    try {
      return await prisma.subscription.create({
        data: {
          userId,
          accountId: data.accountId,
          categoryId: data.categoryId,
          name: data.name,
          amount: data.amount,
          nextBillingDate: data.nextBillingDate,
          active: data.active === undefined ? 1 : data.active ? 1 : 0,
        },
        select: subscriptionSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la suscripción");
    }
  },
};
