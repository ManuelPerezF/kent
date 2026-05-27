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
};
