import "dotenv/config";
import cors from "cors";
import express from "express";
import { authRouter } from "./modules/auth/routes/auth.routes.js";
import { accountsRouter } from "./modules/accounts/routes/accounts.routes.js";
import { categoriesRouter } from "./modules/categories/routes/categories.routes.js";
import { subscriptionsRouter } from "./modules/subscriptions/routes/subscriptions.routes.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/subscriptions", subscriptionsRouter);

app.use(errorMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
