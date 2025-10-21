import { Request } from "express";
import { config } from "../config/config";

export function getIncomingToken(req: Request): string | null {
  const cookieToken = (req as any).cookies?.[config.cookie.name];
  const authHeader = req.headers.authorization;
  const bearer = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  return cookieToken || bearer || null;
}
