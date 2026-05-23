import express, { type Application } from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issue/issue.route";

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to DevPulse API",
    author: "theshameem",
  });
});
