import { Router } from "express";
import { AuthenticationController } from "./controller";
import { wrapController, validateRequest } from "../../utils/express/wrappers";
import { loginUserSchema, registerUserSchema } from "./validations";

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
