import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../shared/middlewares/auth.middleware.js";
import { categoriesService } from "../services/categories.service.js";
import type { CreateCategoryBody } from "../models/categories.model.js";

export const categoriesController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const categories = await categoriesService.list(userId);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const category = await categoriesService.create(userId, req.body as CreateCategoryBody);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },
};
