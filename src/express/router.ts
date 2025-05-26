import { Router } from "express";
import { authenticationRouter } from "./authentication/router";
// import userRouter from "./users/router";

export const appRouter = Router();

appRouter.use("/auth", authenticationRouter);
// router.use("/users", userRouter);
