import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import { computeAccountBalance } from "../../../shared/utils/accountBalance.js";
import { addMonths, startOfToday } from "../../../shared/utils/dates.js";
import { parseDateRangeQuery } from "../../../shared/utils/dateRange.js";
import {
  subscriptionSelectPublic,
  type CreateSubscriptionBody,
  type Subscription,
  type UpcomingSubscription,
  type UpdateSubscriptionBody,
} from "../models/subscriptions.model.js";

function effectiveNextBillingDate(stored: Date, today: Date): Date {
  let next = new Date(stored);
  while (next < today) {
    next = addMonths(next, 1);
  }
  return next;
}

export const subscriptionsService = {
  async list(userId: number): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: { userId },
      select: subscriptionSelectPublic,
      orderBy: { nextBillingDate: "asc" },
    });
  },

  async update(
    userId: number,
    subscriptionId: number,
    data: UpdateSubscriptionBody,
  ): Promise<Subscription> {
    const existing = await prisma.subscription.findFirst({
      where: { id: subscriptionId, userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundError("Suscripción no encontrada");
    }

    try {
      return await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { active: data.active ? 1 : 0 },
        select: subscriptionSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo actualizar la suscripción");
    }
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
      select: {
        id: true,
        initialBalance: true,
        transactions: { select: { type: true, amount: true } },
      },
    });

    if (!account) {
      throw new NotFoundError("Cuenta no encontrada");
    }

    const isActive = data.active === undefined ? true : data.active;

    if (isActive) {
      const balance = computeAccountBalance(account.initialBalance, account.transactions);
      if (balance < data.amount) {
        throw new ValidationError(
          `Saldo insuficiente para el primer cargo. Disponible: ${balance.toFixed(2)}`,
        );
      }
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const firstBillingDate = data.nextBillingDate;

        const subscription = await tx.subscription.create({
          data: {
            userId,
            accountId: data.accountId,
            categoryId: data.categoryId,
            name: data.name,
            amount: data.amount,
            nextBillingDate: firstBillingDate,
            active: isActive ? 1 : 0,
          },
          select: subscriptionSelectPublic,
        });

        if (!isActive) {
          return subscription;
        }

        await tx.transaction.create({
          data: {
            userId,
            accountId: data.accountId,
            categoryId: data.categoryId,
            type: "GASTO",
            amount: data.amount,
            occurredAt: firstBillingDate,
            note: `${data.name} (suscripción)`,
          },
        });

        return tx.subscription.update({
          where: { id: subscription.id },
          data: { nextBillingDate: addMonths(firstBillingDate, 1) },
          select: subscriptionSelectPublic,
        });
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("No se pudo crear la suscripción");
    }
  },

  async upcoming(
    userId: number,
    fromParam?: unknown,
    toParam?: unknown,
    limit = 5,
  ): Promise<UpcomingSubscription[]> {
    const today = startOfToday();
    const to =
      fromParam !== undefined && toParam !== undefined
        ? parseDateRangeQuery(fromParam, toParam).to
        : undefined;

    const rows = await prisma.subscription.findMany({
      where: {
        userId,
        active: 1,
      },
      select: {
        id: true,
        name: true,
        amount: true,
        nextBillingDate: true,
        accountId: true,
        account: { select: { name: true } },
      },
    });

    return rows
      .map((row) => ({
        id: row.id,
        name: row.name,
        amount: row.amount,
        nextBillingDate: effectiveNextBillingDate(row.nextBillingDate, today),
        accountId: row.accountId,
        accountName: row.account.name,
      }))
      .filter((row) => {
        if (row.nextBillingDate < today) return false;
        if (to !== undefined && row.nextBillingDate > to) return false;
        return true;
      })
      .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime())
      .slice(0, limit);
  },
};
