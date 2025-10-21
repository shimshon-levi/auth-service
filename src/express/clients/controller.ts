// src/express/engagements/controller.ts
import { Response } from "express";
import { TypedRequest } from "../../utils/zod";
import { createEngagementSchema, getMyEngagementSchema } from "./validations";
import { EngagementManager } from "./manager";
import { getIncomingToken } from "../../utils/getIncomingToken";
import { requireUser } from "../../utils/assertions";

export class EngagementController {
  static createOne = async (
    req: TypedRequest<typeof createEngagementSchema>,
    res: Response
  ) => {
    const { userId: clientUserId } = req.body;
    const token = getIncomingToken(req) ?? undefined;

    res.json(await EngagementManager.create({ clientUserId }, token));
  };

  static getMyClients = async (
    req: TypedRequest<typeof getMyEngagementSchema>,
    res: Response
  ) => {
    const token = getIncomingToken(req) ?? undefined;
    res.json(await EngagementManager.getMyClients(token));
  };
}
