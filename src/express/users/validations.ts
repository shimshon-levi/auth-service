import { z } from "zod";

export const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User id is required"),
  }),
  query: z.object({}).default({}),
  body: z.object({
    role: z.enum(["admin", "client"]),
  }),
});
