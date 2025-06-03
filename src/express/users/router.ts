import { Router } from "express";
import { config } from "../../config/config";
import { wrapProxy } from "../../utils/express/wrappers";

const {
  users: { uri },
} = config;

export const usersRouter = Router();

usersRouter.all("*", wrapProxy(uri));
