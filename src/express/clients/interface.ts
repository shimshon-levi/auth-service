type EngagementStatus = "active" | "paused" | "ended";

export interface IEngagement {
  id?: string; // MongoDB ObjectId as a string
  clientUserId: string; // היה userId
  advisorUserId: string; // היה advisorId
  caseIds?: string[];
  status?: EngagementStatus; // ברירת מחדל: "active"
  startedAt?: Date; // default: now
  endedAt?: Date;
  notes?: string;
}
