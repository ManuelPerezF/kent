import "dotenv/config";
import express from "express";
import { authRouter } from "./modules/auth/routes/auth.routes.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
