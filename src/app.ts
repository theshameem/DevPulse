import express, { type Application } from "express";
import { authRouter } from "./modules/auth/auth.route";

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
