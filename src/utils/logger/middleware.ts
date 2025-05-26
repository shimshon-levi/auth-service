import expressWinston from "express-winston";
import { logger } from ".";

export const loggerMiddleware = expressWinston.logger({
  transports: [logger],
  expressFormat: true,
  statusLevels: true,
});
