import { Router } from "express";
import { validateRequest, wrapController } from "../../utils/express/wrappers";
import { authMiddleware } from "../../utils/authMiddleware";
import { requireAdmin } from "../../utils/requireAdmin";
import { UsersAdminController } from "./controller";
import { updateUserRoleSchema } from "./validations";

export const usersAdminRouter = Router();

// כל הנתיבים כאן דורשים התחברות + אדמין
usersAdminRouter.use(authMiddleware, requireAdmin);

// PATCH /users/:id/role
usersAdminRouter.patch(
  "/:id/role",
  validateRequest(updateUserRoleSchema),
  wrapController(UsersAdminController.updateRole)
);
