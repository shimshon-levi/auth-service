// src/express/server.ts
import cookieParser from "cookie-parser";
import { once } from "events";
import express from "express";
import helmet from "helmet";
import http from "http";
import cors from "cors";
import session from "express-session";
import { errorMiddleware } from "../utils/express/error";
import { config } from "../config/config";
import { loggerMiddleware } from "../utils/logger/middleware";
import { appRouter } from "./router";

export class Server {
  private app: express.Application;
  private http!: http.Server;

  constructor(private port: number) {
    this.app = Server.createExpressApp();
  }

  static createExpressApp() {
    const app = express();

    app.use(helmet());
    app.use(express.json({ limit: config.service.maxFileSize }));
    app.use(
      express.urlencoded({ extended: true, limit: config.service.maxFileSize })
    );

    app.use(
      cors({
        origin: ["http://localhost:5173", "http://localhost:8000"],
        credentials: true,
      })
    );

    app.use(loggerMiddleware);
    app.use(cookieParser());

    // אם אין לך שימוש ב-session בצד השרת – אפשר להסיר לגמרי.
    app.use(
      session({
        secret: config.authentication.sessionSecret,
        resave: false,
        saveUninitialized: true,
      })
    );

    app.use(appRouter);
    app.use(errorMiddleware);

    return app;
  }

  async start() {
    this.http = this.app.listen(this.port);
    await once(this.http, "listening");
  }
}
