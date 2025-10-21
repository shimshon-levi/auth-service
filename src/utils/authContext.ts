// src/utils/authContext.ts
import type { Request, Response, NextFunction, RequestHandler } from "express";
import { getIncomingToken } from "./getIncomingToken";
import { requireUser } from "./assertions";
import type { JwtUser } from "./zod";

// הוספת שדה auth ל-Request (user + token), שיהיה זמין בכל הבקרים
declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      user: JwtUser;
      token?: string;
    };
  }
}

export const authContext: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const user = requireUser(req); // זורק 401 אם אין משתמש
  const token = getIncomingToken(req) ?? undefined; // Bearer או Cookie אם יש
  req.auth = { user, token };
  next();
};

// עוזר קטן אם תרצה לבנות כותרות ל-axios
export function authHeaders(req: Request) {
  const t = req.auth?.token;
  return t ? { authorization: `Bearer ${t}` } : {};
}
