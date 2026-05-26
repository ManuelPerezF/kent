import { InternalServerError } from "../../../shared/errors/appError.js";
import { prisma } from "../../../shared/db/prisma.js";
import {
  categorySelectPublic,
  type Category,
  type CreateCategoryBody,
} from "../models/categories.model.js";

/** Lógica de negocio y acceso a datos de categorías. */
export const categoriesService = {
  async list(userId: number): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId },
      select: categorySelectPublic,
      orderBy: { name: "asc" },
    });
  },

  async create(userId: number, data: CreateCategoryBody): Promise<Category> {
    try {
      return await prisma.category.create({
        data:
          data.color === undefined
            ? { userId, name: data.name }
            : { userId, name: data.name, color: data.color },
        select: categorySelectPublic,
      });
    } catch {
      throw new InternalServerError("No se pudo crear la categoría");
    }
  },
};
