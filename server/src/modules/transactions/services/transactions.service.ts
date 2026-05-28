import {
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import { computeAccountBalance } from "../../../shared/utils/accountBalance.js";
import {
  transactionSelectPublic,
  type CreateTransactionBody,
  type ListTransactionsQuery,
  type Transaction,
} from "../models/transactions.model.js";

/** Lógica de negocio y acceso a datos de transacciones. */
export const transactionsService = {
  async list(userId: number, query: ListTransactionsQuery = {}): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: {
        userId,
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
      select: {
        id: true,
        initialBalance: true,
        transactions: { select: { type: true, amount: true } },
      },
    });

    if (!account) {
      throw new NotFoundError("Cuenta no encontrada");
    }

    const accountBalance = computeAccountBalance(account.initialBalance, account.transactions);

    if (data.type === "GASTO" && accountBalance < data.amount) {
      throw new ValidationError(
        `Saldo insuficiente en la cuenta. Disponible: ${accountBalance.toFixed(2)}`,
      );
    }

    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId },
      select: { id: true, kind: true },
    });

    if (!category) {
      throw new NotFoundError("Categoría no encontrada");
    }

    if (category.kind !== data.type) {
      throw new ValidationError("La categoría no corresponde al tipo de movimiento");
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
        data: data.note === undefined ? base : { ...base, note: data.note },
        select: transactionSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la transacción");
    }
  },
};
