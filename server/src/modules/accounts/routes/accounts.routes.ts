import { Router } from "express";
import { authenticateJWT } from "../../../shared/middlewares/auth.middleware.js";
import { validateBody } from "../../../shared/utils/validateBody.js";
import { accountsController } from "../controllers/accounts.controller.js";
import { createAccountBodySchema } from "../models/accounts.model.js";

export const accountsRouter = Router();

accountsRouter.use(authenticateJWT);

accountsRouter.get("/", accountsController.list);

accountsRouter.post("/", validateBody(createAccountBodySchema), accountsController.create);
