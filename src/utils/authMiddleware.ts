import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

type Role = "admin" | "client" | "advisor";
type JwtPayload = {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; email?: string; role: Role };
  }
}

// חשוב: להצהיר במפורש RequestHandler ולהחזיר תמיד void (עם return; ריק)
export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 0) אם ה-Gateway הזריק זהות – נסמוך עליו
    const xId = req.header("x-user-id");
    const xRole = req.header("x-user-role") as Role | undefined;
    const xEmail = req.header("x-user-email") ?? undefined;
    if (xId && xRole) {
      req.user = { id: xId, role: xRole, email: xEmail };
      next();
      return;
    }

    // 1) עדיפות ל-Bearer, אחר כך קוקי
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice("Bearer ".length)
      : undefined;

    const cookieToken = (req as any).cookies?.[config.cookie.name] as
      | string
      | undefined;

    const token = bearerToken || cookieToken;
    if (!token) {
      res.status(401).json({ message: "Missing or invalid token" });
      return; // ← להחזיר void
    }

    // 2) אימות JWT
    const payload = jwt.verify(
      token,
      config.authentication.secret
    ) as JwtPayload;

    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (e: any) {
    const message =
      e?.name === "TokenExpiredError"
        ? "Token expired"
        : "Invalid or expired token";
    res.status(401).json({ message });
    return; // ← להחזיר void
  }
};
