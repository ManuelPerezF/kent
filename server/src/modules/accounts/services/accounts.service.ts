import { InternalServerError } from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import { computeAccountBalance } from "../../../shared/utils/accountBalance.js";
import {
  accountSelectPublic,
  type AccountWithBalance,
  type CreateAccountBody,
} from "../models/accounts.model.js";

function toAccountWithBalance(
  account: {
    id: number;
    userId: number;
    name: string;
    type: "EFECTIVO" | "TARJETA";
    initialBalance: number;
    transactions: { type: "INGRESO" | "GASTO"; amount: number }[];
  },
): AccountWithBalance {
  const { transactions, ...rest } = account;
  return {
    ...rest,
    balance: computeAccountBalance(rest.initialBalance, transactions),
  };
}

/** Lógica de negocio y acceso a datos de cuentas. */
export const accountsService = {
  async list(userId: number): Promise<AccountWithBalance[]> {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        ...accountSelectPublic,
        transactions: { select: { type: true, amount: true } },
      },
      orderBy: { name: "asc" },
    });

    return accounts.map(toAccountWithBalance);
  },

  async create(userId: number, data: CreateAccountBody): Promise<AccountWithBalance> {
    try {
      const base = { userId, name: data.name, type: data.type };
      const created = await prisma.account.create({
        data:
          data.initialBalance === undefined
            ? base
            : { ...base, initialBalance: data.initialBalance },
        select: accountSelectPublic,
      });

      return {
        ...created,
        balance: created.initialBalance,
      };
    } catch {
      throw new InternalServerError("No se pudo crear la cuenta");
    }
  },
};
