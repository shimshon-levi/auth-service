import { Router } from "express";
import { authenticationRouter } from "./authentication/router";
import { config } from "../config/config";
import { usersRouter } from "./users/router";

import { wrapProxy } from "../utils/express/wrappers";
const {
  users: { uri },
} = config;

export const appRouter = Router();

appRouter.get(["/isAlive", "/isalive", "/health"], (req, res) => {
  res.status(200).json({ status: "ok" });
});

appRouter.use("/auth", authenticationRouter);

// usersRouter.all("*", wrapProxy(uri));

// appRouter.use("*", (req, res) => {
//   console.log(`Wildcard route called for: ${req.method} ${req.url}`);
//   res.status(404).json({ error: "🔍 הכתובת לא קיימת. זהו שרת API בלבד." });
// });
