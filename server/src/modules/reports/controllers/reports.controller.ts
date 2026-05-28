import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../shared/middlewares/auth.middleware.js";
import { reportsService } from "../services/reports.service.js";

export const reportsController = {
  async summary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const summary = await reportsService.getSummary(userId, req.query.from, req.query.to);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  },

  async spendingByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const items = await reportsService.getSpendingByCategory(
        userId,
        req.query.from,
        req.query.to,
      );
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },

  async monthlyExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const months =
        req.query.months !== undefined ? Math.min(Number(req.query.months), 24) : 6;
      const items = await reportsService.getMonthlyExpenses(
        userId,
        Number.isInteger(months) && months > 0 ? months : 6,
        req.query.from,
        req.query.to,
      );
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },

  async spendingByDay(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const items = await reportsService.getSpendingByDay(
        userId,
        req.query.from,
        req.query.to,
      );
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },

  async topExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const limit =
        req.query.limit !== undefined ? Math.min(Number(req.query.limit), 20) : 5;
      const items = await reportsService.getTopExpenses(
        userId,
        req.query.from,
        req.query.to,
        Number.isInteger(limit) && limit > 0 ? limit : 5,
      );
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },
};
