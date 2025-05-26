import { Response } from "express";
import { config } from "../../config/config";

const {
  cookie: { name: cookieName, httpOnly, secure, sameSite, maxAge },
} = config;

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly,
    secure,
    sameSite,
    maxAge,
  });
};
