import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../shared/middlewares/auth.middleware.js";
import { budgetsService } from "../services/budgets.service.js";
import type { CreateBudgetBody } from "../models/budgets.model.js";

export const budgetsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const budgets = await budgetsService.list(userId);
      res.status(200).json(budgets);
    } catch (error) {
      next(error);
    }
  },

  async getCurrent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const budget = await budgetsService.getCurrent(userId);
      res.status(200).json(budget);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const budget = await budgetsService.create(userId, req.body as CreateBudgetBody);
      res.status(201).json(budget);
    } catch (error) {
      next(error);
    }
  },
};
