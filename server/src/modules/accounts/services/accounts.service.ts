import { InternalServerError } from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import {
  accountSelectPublic,
  type Account,
  type CreateAccountBody,
} from "../models/accounts.model.js";

/** Lógica de negocio y acceso a datos de cuentas. */
export const accountsService = {
  async list(userId: number): Promise<Account[]> {
    return prisma.account.findMany({
      where: { userId },
      select: accountSelectPublic,
      orderBy: { name: "asc" },
    });
  },

  async create(userId: number, data: CreateAccountBody): Promise<Account> {
    try {
      const base = { userId, name: data.name, type: data.type };
      return await prisma.account.create({
        data:
          data.initialBalance === undefined
            ? base
            : { ...base, initialBalance: data.initialBalance },
        select: accountSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la cuenta");
    }
  },
};
