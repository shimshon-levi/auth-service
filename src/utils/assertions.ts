// src/utils/assertions.ts
import { Request } from "express";
import type { JwtUser } from "../utils/zod";

export function requireUser(req: Request): JwtUser {
  const user = (req as any).user as JwtUser | undefined;
  if (!user) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}
