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
      orderBy: { id: "asc" },
    });
  },

  async create(userId: number, data: CreateAccountBody): Promise<Account> {
    try {
      return await prisma.account.create({
        data:
          data.initialBalance === undefined
            ? { userId, type: data.type }
            : { userId, type: data.type, initialBalance: data.initialBalance },
        select: accountSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la cuenta");
    }
  },
};
