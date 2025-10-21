// import { Router } from "express";
// import { authMiddleware } from "../../utils/authMiddleware";
// import { requireAdmin } from "../../utils/requireAdmin";
// import { validateRequest, wrapController } from "../../utils/express/wrappers";
// import { AdminController } from "./controller";
// import {
//   adminCreateUserSchema,
//   adminLinkExistingUserSchema,
//   adminCreateOrLinkClientSchema,
// } from "./validations";

// export const adminRouter = Router();

// adminRouter.use(authMiddleware, requireAdmin);

// adminRouter.post(
//   "/create-user",
//   validateRequest(adminCreateUserSchema),
//   wrapController(AdminController.createUser)
// );

// adminRouter.post(
//   "/link-existing-user",
//   validateRequest(adminLinkExistingUserSchema),
//   wrapController(AdminController.linkExistingUser)
// );

// adminRouter.post(
//   "/create-client-with-user",
//   validateRequest(adminCreateOrLinkClientSchema),
//   wrapController(AdminController.createClientWithUser)
// );
