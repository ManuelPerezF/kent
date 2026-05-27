import { InternalServerError, NotFoundError } from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import { transactionSelectPublic, type Transaction } from "../../transactions/models/transactions.model.js";
import {
  budgetSelectPublic,
  type Budget,
  type CreateBudgetBody,
} from "../models/budgets.model.js";

export interface BudgetSummary extends Budget {
  spent: number;
  remaining: number;
  expenses: Transaction[];
}

async function buildSummary(budget: Budget): Promise<BudgetSummary> {
  const expenses = await prisma.transaction.findMany({
    where: { budgetId: budget.id, type: "GASTO" },
    select: transactionSelectPublic,
    orderBy: { occurredAt: "desc" },
  });

  const spent = expenses.reduce((total, expense) => total + expense.amount, 0);

  return {
    ...budget,
    spent,
    remaining: budget.amount - spent,
    expenses,
  };
}

/** Lógica de negocio y acceso a datos de presupuestos. */
export const budgetsService = {
  async list(userId: number): Promise<Budget[]> {
    return prisma.budget.findMany({
      where: { userId },
      select: budgetSelectPublic,
      orderBy: { startDate: "desc" },
    });
  },

  async getCurrent(userId: number): Promise<BudgetSummary> {
    const now = new Date();

    const budget = await prisma.budget.findFirst({
      where: {
        userId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      select: budgetSelectPublic,
      orderBy: { startDate: "desc" },
    });

    if (!budget) {
      throw new NotFoundError("No hay un presupuesto activo para la fecha actual");
    }

    return buildSummary(budget);
  },

  async create(userId: number, data: CreateBudgetBody): Promise<BudgetSummary> {
    try {
      const budget = await prisma.budget.create({
        data: {
          userId,
          amount: data.amount,
          startDate: data.startDate,
          endDate: data.endDate,
        },
        select: budgetSelectPublic,
      });

      return buildSummary(budget);
    } catch {
      throw new InternalServerError("No se pudo crear el presupuesto");
    }
  },
};
