import { RequestHandler } from "express";

export const requireAdmin: RequestHandler = (req, res, next) => {
  const role = (req as any)?.user?.role;
  if (role !== "admin") {
    res.status(403).json({ message: "Admins only" });
    return;
  }
  next();
};
