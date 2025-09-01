import { Router } from "express";
import { AuthenticationController } from "./controller";
import { wrapController, validateRequest } from "../../utils/express/wrappers";
import { loginUserSchema, registerUserSchema } from "./validations";
import { authMiddleware } from "../../utils/authMiddleware";
import { clearAuthCookie } from "../../utils/express/setAuthCookie";

export const authenticationRouter = Router();

authenticationRouter.post(
  "/register",
  validateRequest(registerUserSchema),
  wrapController(AuthenticationController.register)
);

authenticationRouter.post(
  "/login",
  validateRequest(loginUserSchema),
  wrapController(AuthenticationController.login)
);

authenticationRouter.get("/me", authMiddleware, (req, res) => {
  const { id, email, role } = (req as any).user;
  res.json({ userId: id, email, role });
});

authenticationRouter.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.sendStatus(204);
});
