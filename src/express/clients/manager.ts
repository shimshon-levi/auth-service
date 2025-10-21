import { ServiceError } from "../../utils/errors";
import { EngagementService } from "./service";
import { IEngagement } from "./interface";

export class EngagementManager {
  static async create(payload: { clientUserId: string }, token?: string) {
    if (!payload.clientUserId) throw ServiceError.usersFetchError();
    return EngagementService.create(payload, token);
  }

  static async getMyClients(token?: string): Promise<IEngagement[]> {
    if (!token) throw ServiceError.usersFetchError();
    return EngagementService.getMyClients(token);
  }
}
