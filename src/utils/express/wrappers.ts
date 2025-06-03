import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { TypedRequest } from "../zod";
import { config } from "../../config/config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

export const wrapMiddleware = (
  func: (req: Request, res?: Response) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res).then(next).catch(next);
  };
};

export const wrapController = (
  func: (
    req: TypedRequest<AnyZodObject>,
    res: Response,
    next?: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};

const { service } = config;
export const wrapProxy = (
  uri: string,
  Timeout: number = service.requestTimeout
) => {
  return createProxyMiddleware({
    target: uri,
    proxyTimeout: Timeout,
  });
};

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
