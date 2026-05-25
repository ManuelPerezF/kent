import { InternalServerError } from "../../../shared/errors/appError.js";
import {categoriesRepository, type Category,} from "../repositories/categories.repository.js";
import type { CreateCategoryBody } from "../schemas/categories.schema.js";


export const categoriesService = {
  async list(userId: number): Promise<Category[]> {
    return categoriesRepository.findAllByUserId(userId);
  },

  async create(userId: number, data: CreateCategoryBody): Promise<Category> {
    try {
      return await categoriesRepository.create(userId, data.name, data.color);
    } catch {
      throw new InternalServerError("No se pudo crear la categoría");
    }
  },
};
