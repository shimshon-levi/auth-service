// clients/validations.ts
import { z } from "zod";
import { zodMongoObjectId } from "../../utils/zod";

// יצירת לקוח
export const createEngagementSchema = z.object({
  body: z.object({
    userId: zodMongoObjectId, // רק את זה נקבל מה-body
    // advisorId — לא מה-body!
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

// עדכון לקוח
export const updateEngagementSchema = z.object({
  body: z.object({
    caseIds: z.array(zodMongoObjectId).optional(),
  }),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

// לקוחות שלי
export const getMyEngagementSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({}).default({}),
});

// לפי פילטר
export const getByQueryEngagementSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z
    .object({
      step: z.string().regex(/^\d+$/).optional(),
      limit: z.string().regex(/^\d+$/).optional(),
      role: z.enum(["client", "admin"]).optional(),
      advisorId: zodMongoObjectId.optional(),
    })
    .default({}),
});
// init
