import { z } from "zod";
import { zodMongoObjectId } from "../../utils/zod";

// יצירת User ע"י מנהל (ללא קישור Client)
export const adminCreateUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().min(9).max(15).optional(),
    address: z.string().min(5).optional(),
    role: z.enum(["admin", "client"]).default("client"),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

// קישור User קיים ל־advisor המחובר (userId או email)
export const adminLinkExistingUserSchema = z.object({
  body: z
    .object({
      userId: zodMongoObjectId.optional(),
      email: z.string().email().optional(),
    })
    .refine((v) => !!v.userId || !!v.email, {
      message: "userId או email נדרש",
    }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

// אורקסטרציה: מצא/צור User → צור Client וקשר ליועץ המחובר
export const adminCreateOrLinkClientSchema = z.object({
  body: z
    .object({
      userId: zodMongoObjectId.optional(),
      email: z.string().email().optional(),
      createIfMissing: z.boolean().default(true),

      // לשימוש רק אם יוצרים חדש:
      name: z.string().min(2).optional(),
      password: z.string().min(6).optional(),
      phone: z.string().min(9).max(15).optional(),
      address: z.string().min(5).optional(),
      role: z.enum(["admin", "client"]).default("client"),
    })
    .refine((v) => !!v.userId || !!v.email, {
      message: "userId או email נדרש",
    }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});
