import { Router } from "express";
import { authenticateJWT } from "../../../shared/middlewares/auth.middleware.js";
import { validateBody } from "../../../shared/utils/validateBody.js";
import { transactionsController } from "../controllers/transactions.controller.js";
import { createTransactionBodySchema } from "../models/transactions.model.js";

export const transactionsRouter = Router();

transactionsRouter.use(authenticateJWT);

transactionsRouter.get("/", transactionsController.list);

transactionsRouter.post("/", validateBody(createTransactionBodySchema), transactionsController.create);
