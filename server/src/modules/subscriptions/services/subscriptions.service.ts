import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import { parseDateRangeQuery } from "../../../shared/utils/dateRange.js";
import {
  subscriptionSelectPublic,
  type CreateSubscriptionBody,
  type Subscription,
  type UpcomingSubscription,
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
      select: { id: true, kind: true },
    });

    if (!category) {
      throw new NotFoundError("Categoría no encontrada");
    }

    if (category.kind !== "GASTO") {
      throw new ValidationError("La categoría de una suscripción debe ser de tipo GASTO");
    }

    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
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

  async upcoming(
    userId: number,
    fromParam?: unknown,
    toParam?: unknown,
    limit = 5,
  ): Promise<UpcomingSubscription[]> {
    const { from, to } = parseDateRangeQuery(fromParam, toParam);

    const rows = await prisma.subscription.findMany({
      where: {
        userId,
        active: 1,
        nextBillingDate: { gte: from, lte: to },
      },
      select: {
        id: true,
        name: true,
        amount: true,
        nextBillingDate: true,
        accountId: true,
        account: { select: { name: true } },
      },
      orderBy: { nextBillingDate: "asc" },
      take: limit,
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      amount: row.amount,
      nextBillingDate: row.nextBillingDate,
      accountId: row.accountId,
      accountName: row.account.name,
    }));
  },
};
