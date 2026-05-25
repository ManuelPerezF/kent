import { Prisma } from "../../../prisma/client/client.js";
import { prisma } from "../../../shared/db/prisma.js";

const SELECT_PUBLIC = { id: true, userId: true, name: true, color: true } as const;

export type Category = Prisma.CategoryGetPayload<{ select: typeof SELECT_PUBLIC }>;


export const categoriesRepository = {
  async findAllByUserId(userId: number): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId },
      select: SELECT_PUBLIC,
      orderBy: { name: "asc" },
    });
  },


  async create(userId: number, name: string, color?: string): Promise<Category> {
    return prisma.category.create({
      data: color === undefined ? { userId, name } : { userId, name, color },
      select: SELECT_PUBLIC,
    });
  },
};
