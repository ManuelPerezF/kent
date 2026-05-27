import { prisma } from "../../../shared/db/prisma.js";
import { parseDateRangeQuery } from "../../../shared/utils/dateRange.js";
import type {
  CategorySpendingItem,
  ReportsSummaryResponse,
} from "../models/reports.model.js";

async function getAccountBalanceTotal(userId: number): Promise<number> {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: {
      initialBalance: true,
      transactions: {
        select: { type: true, amount: true },
      },
    },
  });

  return accounts.reduce((total, account) => {
    const net = account.transactions.reduce((sum, tx) => {
      return tx.type === "INGRESO" ? sum + tx.amount : sum - tx.amount;
    }, account.initialBalance);

    return total + net;
  }, 0);
}

async function getTransactionMetric(
  userId: number,
  type: "INGRESO" | "GASTO",
  from: Date,
  to: Date,
) {
  const aggregate = await prisma.transaction.aggregate({
    where: {
      userId,
      type,
      occurredAt: { gte: from, lte: to },
    },
    _sum: { amount: true },
    _count: { _all: true },
  });

  return {
    total: aggregate._sum.amount ?? 0,
    count: aggregate._count._all,
  };
}

async function getUpcomingSubscriptionsTotal(
  userId: number,
  from: Date,
  to: Date,
): Promise<number> {
  const aggregate = await prisma.subscription.aggregate({
    where: {
      userId,
      active: 1,
      nextBillingDate: { gte: from, lte: to },
    },
    _sum: { amount: true },
  });

  return aggregate._sum.amount ?? 0;
}

/** Agregaciones para el dashboard del expense tracker. */
export const reportsService = {
  async getSummary(
    userId: number,
    fromParam?: unknown,
    toParam?: unknown,
  ): Promise<ReportsSummaryResponse> {
    const { from, to } = parseDateRangeQuery(fromParam, toParam);

    const [income, expense, recurringAggregate, accountBalance, upcomingTotal] =
      await Promise.all([
        getTransactionMetric(userId, "INGRESO", from, to),
        getTransactionMetric(userId, "GASTO", from, to),
        prisma.subscription.aggregate({
          where: { userId, active: 1 },
          _sum: { amount: true },
          _count: { _all: true },
        }),
        getAccountBalanceTotal(userId),
        getUpcomingSubscriptionsTotal(userId, from, to),
      ]);

    return {
      period: { from, to },
      income,
      expense,
      recurring: {
        total: recurringAggregate._sum.amount ?? 0,
        count: recurringAggregate._count._all,
      },
      available: accountBalance - upcomingTotal,
    };
  },

  async getSpendingByCategory(
    userId: number,
    fromParam?: unknown,
    toParam?: unknown,
  ): Promise<CategorySpendingItem[]> {
    const { from, to } = parseDateRangeQuery(fromParam, toParam);

    const grouped = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "GASTO",
        occurredAt: { gte: from, lte: to },
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    });

    if (grouped.length === 0) {
      return [];
    }

    const categoryIds = grouped.map((item) => item.categoryId);
    const categories = await prisma.category.findMany({
      where: { userId, id: { in: categoryIds } },
      select: { id: true, name: true, color: true, monthlyLimit: true },
    });

    const categoryMap = new Map(categories.map((category) => [category.id, category]));

    return grouped
      .map((item) => {
        const category = categoryMap.get(item.categoryId);
        if (!category) {
          return null;
        }

        const spent = item._sum.amount ?? 0;
        const limit = category.monthlyLimit;
        const progressPct =
          limit !== null && limit > 0 ? Math.round((spent / limit) * 100) : null;

        return {
          categoryId: category.id,
          categoryName: category.name,
          color: category.color,
          spent,
          limit,
          progressPct,
        };
      })
      .filter((item): item is CategorySpendingItem => item !== null);
  },
};
