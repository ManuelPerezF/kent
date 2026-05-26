import type { NextFunction, Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../shared/middlewares/auth.middleware.js";
import { subscriptionsService } from "../services/subscriptions.service.js";
import type { CreateSubscriptionBody } from "../models/subscriptions.model.js";

export const subscriptionsController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const subscriptions = await subscriptionsService.list(userId);
      res.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sub: userId } = (req as AuthenticatedRequest).user;
      const subscription = await subscriptionsService.create(
        userId,
        req.body as CreateSubscriptionBody,
      );
      res.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  },
};
