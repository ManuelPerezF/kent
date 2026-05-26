import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../shared/middlewares/auth.middleware.js";
import { accountsService } from "../services/accounts.service.js";
import type { CreateAccountBody } from "../models/accounts.model.js";

export const accountsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const accounts = await accountsService.list(userId);
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const account = await accountsService.create(userId, req.body as CreateAccountBody);
      res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  },
};
