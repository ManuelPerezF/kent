import { Router } from "express";
import { authenticateJWT } from "../../../shared/middlewares/auth.middleware.js";
import { validateBody } from "../../../shared/utils/validateBody.js";
import { categoriesController } from "../controllers/categories.controller.js";
import { createCategoryBodySchema } from "../models/categories.model.js";

export const categoriesRouter = Router();

categoriesRouter.use(authenticateJWT);

categoriesRouter.get("/", categoriesController.list);

categoriesRouter.post("/", validateBody(createCategoryBodySchema), categoriesController.create);
