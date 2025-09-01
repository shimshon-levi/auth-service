// src/express/templates/templatesGatewayRouter.ts
import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { config } from "../../config/config";

export const templatesGatewayRouter = Router();

templatesGatewayRouter.use(
  "/",
  createProxyMiddleware({
    target: config.templates.uri, // http://localhost:8001
    changeOrigin: true,
    proxyTimeout: config.service.requestTimeout,
    on: { proxyReq: (proxyReq, req) => fixRequestBody(proxyReq, req as any) },
  })
);
