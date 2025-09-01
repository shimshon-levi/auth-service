import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../users/model";
import { config } from "../../config/config";
import { logger } from "../../utils/logger/index";
import { ServiceError } from "../../utils/errors";
import { AuthenticationManager } from "./manager";
import { TypedRequest } from "../../utils/zod";
import { loginUserSchema, registerUserSchema } from "./validations";
import { setAuthCookie } from "../../utils/express/setAuthCookie";
import { RegisterInput } from "./interface";

export class AuthenticationController {
  static async register(
    req: TypedRequest<typeof registerUserSchema>,
    res: Response
  ) {
    const { token, userId, role } = await AuthenticationManager.register(
      req.body
    );
    setAuthCookie(res, token);
    console.log(token, userId, role);

    res.json({ token, userId, role });
  }

  static async login(req: TypedRequest<typeof loginUserSchema>, res: Response) {
    const { email, password } = req.body;
    const { token, userId, role } = await AuthenticationManager.login(
      email,
      password
    );
    setAuthCookie(res, token);
    res.json({ token, userId, role });
  }
}
