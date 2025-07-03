// schemas/userSchemas.ts
import { z } from "zod";

// סכימה לגוף הבקשה בעת הרשמה
export const registerUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().min(9).max(15).optional(),
  address: z.string().min(5).optional(),
  role: z.enum(["admin", "client"]).default("client"), // ברירת מחדל היא "client"
});

// סכימה לגוף הבקשה בעת התחברות
export const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// סכימה מלאה לרישום משתמש, מותאמת ל־validateRequest
export const registerUserSchema = z.object({
  body: registerUserBodySchema,
  query: z.object({}).default({}), // ← התיקון כאן
  params: z.object({}).default({}), // ← וגם כאן
});

// סכימה מלאה להתחברות משתמש, גם כן מתוקנת
export const loginUserSchema = z.object({
  body: loginUserBodySchema,
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});
