import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { TypedRequest } from "../zod";
import { config } from "../../config/config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

/**
 * עוטף middleware אסינכרוני כך שכל שגיאה תיתפס ע"י next(error).
 * חשוב: לקרוא next בלי ארגומנטים – לא להעביר אותו ישירות ל-then.
 */
export const wrapMiddleware = (
  func: (req: Request, res?: Response) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res)
      .then(() => next()) // <<< השינוי הקריטי
      .catch(next);
  };
};

/**
 * עוטף controller אסינכרוני כך ששגיאות יחלחלו ל-error middleware.
 */
export const wrapController = (
  func: (
    req: TypedRequest<AnyZodObject>,
    res: Response,
    next?: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req as any, res, next).catch(next);
  };
};

const { service } = config;

/**
 * פרוקסי לשירותי משנה. שומר על Host/CORS, מתקן body כשהשתמשנו ב-express.json(),
 * ומגדיר timeout. השארתי מינימלי כדי "רק שיעבוד".
 */
export const wrapProxy = (
  uri: string,
  Timeout: number = service.requestTimeout
) => {
  return createProxyMiddleware({
    target: uri,
    changeOrigin: true, // עקביות Host/CORS
    proxyTimeout: Timeout,
    on: {
      proxyReq: (proxyReq, req, _res) => {
        // אם body כבר נותח ע"י express.json(), מתקנים לפני שליחה לשירות downstream
        fixRequestBody(proxyReq, req as any);
      },
    },
  });
};

/**
 * ולידציה עם Zod לכל בקשה, לפני שמגיעים ל-controller.
 * מעדכנים את req.body/query/params בגרסה שעברה parsing ואימות.
 */
export const validateRequest = (schema: AnyZodObject) => {
  return wrapMiddleware(async (req: Request) => {
    const { body, query, params } = req;
    const {
      body: parsedBody,
      query: parsedQuery,
      params: parsedParams,
    } = await schema.parseAsync({ body, query, params });

    Object.assign(req.body, parsedBody);
    Object.assign(req.query, parsedQuery);
    Object.assign(req.params, parsedParams);
  });
};
