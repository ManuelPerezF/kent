import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import {
  transactionSelectPublic,
  type CreateTransactionBody,
  type ListTransactionsQuery,
  type Transaction,
} from "../models/transactions.model.js";

function isWithinBudgetPeriod(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

/** Lógica de negocio y acceso a datos de transacciones. */
export const transactionsService = {
  async list(userId: number, query: ListTransactionsQuery = {}): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: {
        userId,
        ...(query.budgetId !== undefined ? { budgetId: query.budgetId } : {}),
        ...(query.type !== undefined ? { type: query.type } : {}),
        ...(query.from !== undefined && query.to !== undefined
          ? { occurredAt: { gte: query.from, lte: query.to } }
          : {}),
      },
      select: transactionSelectPublic,
      orderBy: { occurredAt: "desc" },
    });
  },

  async create(userId: number, data: CreateTransactionBody): Promise<Transaction> {
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, userId },
      select: { id: true },
    });

    if (!account) {
      throw new NotFoundError("Cuenta no encontrada");
    }

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundError("Categoría no encontrada");
    }

    if (data.type === "INGRESO" && data.budgetId !== undefined) {
      throw new ValidationError("Un ingreso no puede ligarse a un presupuesto");
    }

    if (data.budgetId !== undefined) {
      if (data.type !== "GASTO") {
        throw new ValidationError("Solo un gasto puede ligarse a un presupuesto");
      }

      const budget = await prisma.budget.findFirst({
        where: { id: data.budgetId, userId },
        select: { id: true, startDate: true, endDate: true },
      });

      if (!budget) {
        throw new NotFoundError("Presupuesto no encontrado");
      }

      if (!isWithinBudgetPeriod(data.occurredAt, budget.startDate, budget.endDate)) {
        throw new ValidationError("La fecha del gasto debe estar dentro del periodo del presupuesto");
      }
    }

    try {
      const base = {
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type,
        amount: data.amount,
        occurredAt: data.occurredAt,
      };

      return await prisma.transaction.create({
        data:
          data.note === undefined
            ? data.budgetId === undefined
              ? base
              : { ...base, budgetId: data.budgetId }
            : data.budgetId === undefined
              ? { ...base, note: data.note }
              : { ...base, note: data.note, budgetId: data.budgetId },
        select: transactionSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la transacción");
    }
  },
};
