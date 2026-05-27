import { Router } from "express";
import { authenticateJWT } from "../../../shared/middlewares/auth.middleware.js";
import { reportsController } from "../controllers/reports.controller.js";

export const reportsRouter = Router();

reportsRouter.use(authenticateJWT);

reportsRouter.get("/summary", reportsController.summary);

reportsRouter.get("/spending-by-category", reportsController.spendingByCategory);
