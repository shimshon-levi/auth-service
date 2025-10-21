import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "../authMiddleware";
import { logger } from "../logger";

type GatewayConfig = {
  name: string;
  mountPath: string; // למשל "/cases" (רק ללוגים/מידע)
  targetUri: string; // למשל "http://localhost:8001"
  targetBaseRoute: string; // למשל "/api/cases"
  requireAuth?: boolean;
};

export function createGatewayRouter({
  name,
  mountPath,
  targetUri,
  targetBaseRoute,
  requireAuth = true,
}: GatewayConfig) {
  const r = Router();

  // לוג את ההגדרות כבר באתחול
  logger.info(
    `[GATEWAY] ${name} -> ${targetUri}${targetBaseRoute} (mount: ${mountPath}, auth: ${requireAuth})`
  );

  if (requireAuth) r.use(authMiddleware);

  // פונקציית rewrite שמדביקה את בסיס היעד לפני ה-path הפנימי של הראוטר
  const normalize = (s: string) => (s.endsWith("/") ? s.slice(0, -1) : s);
  const prefix = normalize(targetBaseRoute);

  r.use(
    "/",
    createProxyMiddleware({
      target: targetUri,
      changeOrigin: true,
      proxyTimeout: 30_000,
      pathRewrite: (path /* e.g. "/my" */, req) => {
        // דואגים שלא יהיו "//"
        const joined = `${prefix}${path.startsWith("/") ? "" : "/"}${path}`;
        return joined.replace(/\/{2,}/g, "/");
      },
      on: {
        proxyReq: (proxyReq, req) => fixRequestBody(proxyReq, req as any),
        proxyRes: (proxyRes, req) => {
          logger.info(
            `[PROXY:${name}] ${req.method} ${(req as any).originalUrl} -> ${
              proxyRes.statusCode
            }`
          );
        },
        error: (err, req) => {
          logger.error(
            `[PROXY:${name}:ERROR] ${req.method} ${
              (req as any).originalUrl
            } :: ${err?.message}`
          );
        },
      },
    })
  );

  return r;
}
