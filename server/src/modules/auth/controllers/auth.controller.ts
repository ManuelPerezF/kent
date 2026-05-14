import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import type { LoginBody, RegisterBody } from "../schemas/auth.schema.js";


export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body as RegisterBody);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body as LoginBody);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
