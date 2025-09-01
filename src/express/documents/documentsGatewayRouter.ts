console.log("[BOOT] loading clientsGatewayRouter");
import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "../../utils/authMiddleware";
import { config } from "../../config/config";

export const documentsGatewayRouter = Router();

documentsGatewayRouter.use(authMiddleware);

documentsGatewayRouter.all(
  "*",
  createProxyMiddleware({
    target: config.documents.uri, // http://localhost:8002
    changeOrigin: true,
    proxyTimeout: config.service.requestTimeout,
    // אם ה-document-service מאזין על /documents אז:
    pathRewrite: { "^/documents": "/documents" },
    on: {
      proxyReq: (proxyReq, req) => fixRequestBody(proxyReq, req as any),
    },
  })
);
