import { Router } from "express";
import { validateBody } from "../../../shared/utils/validateBody.js";
import { authController } from "../controllers/auth.controller.js";
import { loginBodySchema, registerBodySchema } from "../schemas/auth.schema.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerBodySchema), authController.register);

authRouter.post("/login", validateBody(loginBodySchema), authController.login);
