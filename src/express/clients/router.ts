import { Router } from "express";
import { EngagementController } from "./controller";
import { wrapController, validateRequest } from "../../utils/express/wrappers";
import {
  createEngagementSchema,
  getMyEngagementSchema,
  getByQueryEngagementSchema,
} from "./validations";
import { requireAdmin } from "../../utils/requireAdmin";
import { authMiddleware } from "../../utils/authMiddleware";
import { authContext } from "../../utils/authContext";

export const EngagementRouter = Router();

// כל הנתיבים כאן דורשים טוקן
EngagementRouter.use(authMiddleware);
EngagementRouter.use(authContext);

// clients/router.ts
EngagementRouter.post(
  "/",
  requireAdmin, // רק מנהל/יועץ מורשה
  validateRequest(createEngagementSchema),
  wrapController(EngagementController.createOne)
);

EngagementRouter.get(
  "/my-clients",
  requireAdmin,
  validateRequest(getMyEngagementSchema),
  wrapController(EngagementController.getMyClients)
);

// EngagementRouter.get(
//   "/me",
//   validateRequest(getMyEngagementSchema),
//   wrapController(ClientController.getMe)
// );

// EngagementRouter.get(
//   "/",
//   validateRequest(getByQueryEngagementSchema),
//   wrapController(ClientController.getByQuery)
// );
// // init
