// middlewares/authMiddleware.ts
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

type Role = "admin" | "client";
type JwtPayload = {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};

// ודא שיש cookie-parser ב-Server: app.use(cookieParser());
export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    // 1) קודם מה-cookie
    const cookieToken = (req as any).cookies?.[config.cookie.name];

    // 2) נפילה ל-Bearer אם אין קוקי
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = cookieToken || bearerToken;
    if (!token) {
      res.status(401).json({ message: "Missing or invalid token" });
      return; // <- חשוב: להחזיר void, לא Response
    }

    const payload = jwt.verify(
      token,
      config.authentication.secret
    ) as JwtPayload;

    (req as any).user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return; // <- גם כאן void
  }
};
