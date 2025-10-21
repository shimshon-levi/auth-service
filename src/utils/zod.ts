// src/utils/zod.ts
import { Request } from "express";
import { AnyZodObject, z } from "zod";
import { Prettify } from "./types.js";

// === קיימים אצלך ===
export const zodMongoObjectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" });

export type TypedRequest<T extends AnyZodObject> = Prettify<
  Request<
    z.infer<T>["params"],
    unknown,
    z.infer<T>["body"],
    z.infer<T>["query"]
  >
>;

// === חדשים (הוסף את זה) ===
export type Role = "admin" | "client";

export type JwtUser = {
  id: string;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & { user: JwtUser };

// בקונטרולרים: req.user יהיה מטוּפס
export type TypedRequestWithUser<T extends AnyZodObject> = Prettify<
  Request<
    z.infer<T>["params"],
    unknown,
    z.infer<T>["body"],
    z.infer<T>["query"]
  > & {
    user: JwtUser;
  }
>;
