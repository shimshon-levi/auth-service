import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "../authMiddleware";
import { logger } from "../logger";

type GatewayConfig = {
  name: string; // תווית לוג
  mountPath: string; // איפה במתאם (auth-service) אנחנו מאזינים (/clients)
  targetUri: string; // כתובת היעד (http://localhost:8001)
  targetBaseRoute: string; // באיזה path ה-service downstream מאזין (/api/clients)
  requireAuth?: boolean; // אם צריך JWT
};

export function createGatewayRouter({
  name,
  mountPath,
  targetUri,
  targetBaseRoute,
  requireAuth = true,
}: GatewayConfig) {
  const r = Router();

  // הפוך pathRewrite אוטומטית אם צריך
  const needsRewrite = mountPath !== targetBaseRoute;
  const pathRewrite = needsRewrite
    ? { [`^${mountPath}`]: targetBaseRoute }
    : undefined;

  // לוג את ההגדרות כבר באתחול
  logger.info(
    `[GATEWAY] ${name} -> ${targetUri}${targetBaseRoute} (mount: ${mountPath}, rewrite: ${
      needsRewrite ? JSON.stringify(pathRewrite) : "none"
    }, auth: ${requireAuth})`
  );

  if (requireAuth) r.use(authMiddleware);

  r.use(
    "/",
    createProxyMiddleware({
      target: targetUri,
      changeOrigin: true,
      proxyTimeout: 30_000,
      pathRewrite,
      on: {
        proxyReq: (proxyReq, req) => fixRequestBody(proxyReq, req as any),
        proxyRes: (proxyRes, req) => {
          // לוג קליל על כל בקשה עוברת
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
