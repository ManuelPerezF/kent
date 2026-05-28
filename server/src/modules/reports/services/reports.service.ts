import { prisma } from "../../../shared/db/prisma.js";
import { computeAccountBalance } from "../../../shared/utils/accountBalance.js";
import { parseDateRangeQuery } from "../../../shared/utils/dateRange.js";
import { startOfToday } from "../../../shared/utils/dates.js";
import type {
  CategorySpendingItem,
  DailyExpenseItem,
  MonthlyExpenseItem,
  ReportsSummaryResponse,
  TopExpenseItem,
} from "../models/reports.model.js";

const MONTH_LABELS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function getMonthRange(year: number, month: number): { from: Date; to: Date } {
  const from = new Date(year, month, 1);
  from.setHours(0, 0, 0, 0);
  const to = new Date(year, month + 1, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

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

  return accounts.reduce(
    (total, account) => total + computeAccountBalance(account.initialBalance, account.transactions),
    0,
  );
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
  const today = startOfToday();
  const effectiveFrom = from > today ? from : today;

  const aggregate = await prisma.subscription.aggregate({
    where: {
      userId,
      active: 1,
      nextBillingDate: { gte: effectiveFrom, lte: to },
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
      select: { id: true, name: true, color: true },
    });

    const categoryMap = new Map(categories.map((category) => [category.id, category]));

    return grouped
      .map((item) => {
        const category = categoryMap.get(item.categoryId);
        if (!category) {
          return null;
        }

        return {
          categoryId: category.id,
          categoryName: category.name,
          color: category.color,
          spent: item._sum.amount ?? 0,
        };
      })
      .filter((item): item is CategorySpendingItem => item !== null);
  },

  async getMonthlyExpensesForRange(
    userId: number,
    from: Date,
    to: Date,
  ): Promise<MonthlyExpenseItem[]> {
    const months: MonthlyExpenseItem[] = [];
    const cursor = new Date(from.getFullYear(), from.getMonth(), 1);

    while (
      cursor.getFullYear() < to.getFullYear() ||
      (cursor.getFullYear() === to.getFullYear() && cursor.getMonth() <= to.getMonth())
    ) {
      const { from: monthFrom, to: monthTo } = getMonthRange(
        cursor.getFullYear(),
        cursor.getMonth(),
      );

      const aggregate = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "GASTO",
          occurredAt: { gte: monthFrom, lte: monthTo },
        },
        _sum: { amount: true },
      });

      months.push({
        year: cursor.getFullYear(),
        month: cursor.getMonth(),
        label: MONTH_LABELS[cursor.getMonth()] ?? "",
        total: aggregate._sum.amount ?? 0,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    return months;
  },

  async getMonthlyExpenses(
    userId: number,
    months = 6,
    fromParam?: unknown,
    toParam?: unknown,
  ): Promise<MonthlyExpenseItem[]> {
    if (fromParam !== undefined && toParam !== undefined) {
      const { from, to } = parseDateRangeQuery(fromParam, toParam);
      return this.getMonthlyExpensesForRange(userId, from, to);
    }

    const now = new Date();
    const offsets = Array.from({ length: months }, (_, index) => months - 1 - index);

    const totals = await Promise.all(
      offsets.map(async (offset) => {
        const ref = new Date(now.getFullYear(), now.getMonth() - offset, 1);
        const { from, to } = getMonthRange(ref.getFullYear(), ref.getMonth());

        const aggregate = await prisma.transaction.aggregate({
          where: {
            userId,
            type: "GASTO",
            occurredAt: { gte: from, lte: to },
          },
          _sum: { amount: true },
        });

        return {
          year: ref.getFullYear(),
          month: ref.getMonth(),
          label: MONTH_LABELS[ref.getMonth()] ?? "",
          total: aggregate._sum.amount ?? 0,
        };
      }),
    );

    return totals;
  },

  async getSpendingByDay(
    userId: number,
    fromParam?: unknown,
    toParam?: unknown,
  ): Promise<DailyExpenseItem[]> {
    const { from, to } = parseDateRangeQuery(fromParam, toParam);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        type: "GASTO",
        occurredAt: { gte: from, lte: to },
      },
      select: { amount: true, occurredAt: true },
    });

    const totalsByDay = new Map<string, number>();

    for (const transaction of transactions) {
      const dayKey = transaction.occurredAt.toISOString().slice(0, 10);
      totalsByDay.set(dayKey, (totalsByDay.get(dayKey) ?? 0) + transaction.amount);
    }

    const days: DailyExpenseItem[] = [];
    const cursor = new Date(from);

    while (cursor <= to) {
      const dayKey = cursor.toISOString().slice(0, 10);
      days.push({
        date: dayKey,
        label: String(cursor.getDate()),
        total: totalsByDay.get(dayKey) ?? 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  },

  async getTopExpenses(
    userId: number,
    fromParam?: unknown,
    toParam?: unknown,
    limit = 5,
  ): Promise<TopExpenseItem[]> {
    const { from, to } = parseDateRangeQuery(fromParam, toParam);

    const rows = await prisma.transaction.findMany({
      where: {
        userId,
        type: "GASTO",
        occurredAt: { gte: from, lte: to },
      },
      orderBy: { amount: "desc" },
      take: limit,
      select: {
        id: true,
        amount: true,
        occurredAt: true,
        note: true,
        category: { select: { name: true, color: true } },
        account: { select: { name: true } },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      amount: row.amount,
      occurredAt: row.occurredAt,
      note: row.note,
      categoryName: row.category.name,
      categoryColor: row.category.color,
      accountName: row.account.name,
    }));
  },
};
