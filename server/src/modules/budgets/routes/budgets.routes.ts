import { Router } from "express";
import { authenticateJWT } from "../../../shared/middlewares/auth.middleware.js";
import { validateBody } from "../../../shared/utils/validateBody.js";
import { budgetsController } from "../controllers/budgets.controller.js";
import { createBudgetBodySchema } from "../models/budgets.model.js";

export const budgetsRouter = Router();

budgetsRouter.use(authenticateJWT);

budgetsRouter.get("/", budgetsController.list);

budgetsRouter.get("/current", budgetsController.getCurrent);

budgetsRouter.post("/", validateBody(createBudgetBodySchema), budgetsController.create);
