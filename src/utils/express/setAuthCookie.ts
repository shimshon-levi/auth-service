import { Response } from "express";
import { config } from "../../config/config";

const {
  cookie: { name, httpOnly, secure, sameSite, maxAge },
} = config;

/** שומר את ה-JWT בקוקי HttpOnly מאובטח */
export function setAuthCookie(res: Response, token: string) {
  res.cookie(name, token, {
    httpOnly, // מונע גישה מ-JS (הגנה מ-XSS)
    secure, // true בפרודקשן עם HTTPS (בדב זה false)
    sameSite, // "lax" בדב; "none" אם יש דומיינים שונים בפרוד
    maxAge, // משך חיים
    path: "/", // חשוב, שהקוקי יישלח לכל הנתיבים
  });
}

/** מנקה את הקוקי בזמן התנתקות */
export function clearAuthCookie(res: Response) {
  res.clearCookie(name, {
    httpOnly,
    secure,
    sameSite,
    path: "/", // חייב להתאים ל-path של ה-set
  });
}
