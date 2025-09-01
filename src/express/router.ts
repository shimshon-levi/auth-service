// src/express/router.ts
import { Router } from "express";
import { authenticationRouter } from "./authentication/router";
import { clientsGatewayRouter } from "./clients/clientsGatewayRouter";
import { templatesGatewayRouter } from "./templates/templatesGatewayRouter";
import { casesGatewayRouter } from "./cases/casesGatewayRouter";
// import { documentsGatewayRouter } from "./documents/documentsGatewayRouter";
import { authMiddleware } from "../utils/authMiddleware";
import { createGatewayRouter } from "../utils/express/proxy";
import { config } from "../config/config";

export const appRouter = Router();

// בריאות
appRouter.get(["/isAlive", "/isalive", "/health"], (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// אימות (לוגין/הרשמה/me/logout) – ללא צורך באימות
appRouter.use("/auth", authenticationRouter);

// מכאן – הכל מאובטח JWT פעם אחת גלובלית
appRouter.use(authMiddleware);

// Gateways (מאותו שירות 8001, אבל baseRoute שונה לכל תחום)
appRouter.use(
  "/clients",
  createGatewayRouter({
    name: "clients",
    mountPath: "/clients",
    targetUri: config.clients.uri,
    targetBaseRoute: config.clients.baseRoute, // /api/clients
    requireAuth: true,
  })
);

appRouter.use(
  "/cases",
  createGatewayRouter({
    name: "cases",
    mountPath: "/cases",
    targetUri: config.cases.uri,
    targetBaseRoute: config.cases.baseRoute, // /api/cases
    requireAuth: true,
  })
);

appRouter.use(
  "/templates",
  createGatewayRouter({
    name: "templates",
    mountPath: "/templates",
    targetUri: config.templates.uri,
    targetBaseRoute: config.templates.baseRoute, // /api/templates
    requireAuth: true,
  })
);

// דוגמה לפרוקסי ציבורי (ללא JWT):
// appRouter.use(
//   "/public-docs",
//   createGatewayRouter({
//     name: "public-docs",
//     mountPath: "/public-docs",
//     targetUri: config.documents.uri,
//     targetBaseRoute: config.documents.baseRoute,
//     requireAuth: false,
//   })
// );
