import { InternalServerError } from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import {
  accountSelectPublic,
  type Account,
  type CreateAccountBody,
} from "../models/accounts.model.js";


export const accountsService = {
  async list(): Promise<Account[]> {
    return prisma.account.findMany({
      select: accountSelectPublic,
      orderBy: { id: "asc" },
    });
  },

  async create(data: CreateAccountBody): Promise<Account> {
    try {
      return await prisma.account.create({
        data:
          data.initialBalance === undefined
            ? { type: data.type }
            : { type: data.type, initialBalance: data.initialBalance },
        select: accountSelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la cuenta");
    }
  },
};
