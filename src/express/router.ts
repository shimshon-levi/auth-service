import { Router } from "express";
import { authenticationRouter } from "./authentication/router";

// import userRouter from "./users/router";

export const appRouter = Router();

appRouter.get(["/isAlive", "/isalive", "/health"], (req, res) => {
  res.status(200).json({ status: "ok" });
});

appRouter.use("/auth", authenticationRouter);

// appRouter.use("/users", userRouter);

appRouter.get("/", (req, res) => {
  console.log("GET / called");
  res.status(200).send(`👋 Hello from ${req.method} ${req.url}`);
});

// נתיב ברירת מחדל לכל כתובת אחרת שלא קיימת
// appRouter.use("*", (req, res) => {
//   console.log(`Wildcard route called for: ${req.method} ${req.url}`);
//   res.status(404).json({ error: "🔍 הכתובת לא קיימת. זהו שרת API בלבד." });
// });

console.log("✔️ appRouter setup complete");
