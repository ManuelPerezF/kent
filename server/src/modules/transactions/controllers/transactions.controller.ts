import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../shared/errors/appError.js";
import type { AuthenticatedRequest } from "../../../shared/middlewares/auth.middleware.js";
import { parseDateRangeQuery } from "../../../shared/utils/dateRange.js";
import { transactionsService } from "../services/transactions.service.js";
import type { CreateTransactionBody, ListTransactionsQuery } from "../models/transactions.model.js";

function parseListQuery(req: Request): ListTransactionsQuery {
  const query: ListTransactionsQuery = {};

  if (req.query.type !== undefined) {
    if (req.query.type !== "INGRESO" && req.query.type !== "GASTO") {
      throw new ValidationError("type debe ser INGRESO o GASTO");
    }
    query.type = req.query.type;
  }

  if (req.query.from !== undefined || req.query.to !== undefined) {
    const { from, to } = parseDateRangeQuery(req.query.from, req.query.to);
    query.from = from;
    query.to = to;
  }

  return query;
}

export const transactionsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const transactions = await transactionsService.list(userId, parseListQuery(req));
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const transaction = await transactionsService.create(
        userId,
        req.body as CreateTransactionBody,
      );
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  },
};
