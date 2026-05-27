import { Router } from "express";
import { authenticateJWT } from "../../../shared/middlewares/auth.middleware.js";
import { validateBody } from "../../../shared/utils/validateBody.js";
import { subscriptionsController } from "../controllers/subscriptions.controller.js";
import { createSubscriptionBodySchema } from "../models/subscriptions.model.js";

export const subscriptionsRouter = Router();

subscriptionsRouter.use(authenticateJWT);

subscriptionsRouter.get("/upcoming", subscriptionsController.upcoming);

subscriptionsRouter.get("/", subscriptionsController.list);

subscriptionsRouter.post("/",validateBody(createSubscriptionBodySchema),subscriptionsController.create,
);
