import axios from "axios";
import { config } from "../../config/config";
import { IEngagement } from "./interface";

const {
  clients: { uri, baseRoute },
  service,
} = config;

export class EngagementService {
  private static api = axios.create({
    baseURL: `${uri}${baseRoute}`,
    timeout: service.requestTimeout,
  });
  static async create(payload: { clientUserId: string }, token?: string) {
    const { data } = await this.api.post("/", payload, {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
    return data;
  }

  static async getMyClients(token?: string) {
    const { data } = await this.api.get("/my-clients", {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
    return data;
  }

  static async getEngagementByAdvisor(advisorId: string) {
    const { data } = await this.api.get("/", { params: { advisorId } });
    return data;
  }

  static async getEngagementByUserId(userId: string) {
    const { data } = await this.api.get("/by-user", { params: { userId } });
    return data;
  }

  static async getByQuery(query: any, step = 0, limit = 10) {
    const { data } = await this.api.get("/query", {
      params: { ...query, step, limit },
    });
    return data;
  }
  // static async addCaseToClient(clientId: string, caseId: string) {
  //   const { data } = await this.api.post(`/${clientId}/add-case`, { caseId });
  //   return data;
  // }
}
// init
