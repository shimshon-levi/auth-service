import { Response } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";
import UserModel from "../users/model";
import { TypedRequestWithUser } from "../../utils/zod";
import {
  adminCreateUserSchema,
  adminLinkExistingUserSchema,
  adminCreateOrLinkClientSchema,
} from "./validations";
import { getIncomingToken } from "../../utils/getIncomingToken";
import { config } from "../../config/config";

// טיפוס מינימלי נוח למונגוס (למנוע שגיאות never/null)
type MinimalUserDoc = {
  _id: string;
  email: string;
  role: "admin" | "client";
} & Record<string, any>;

async function createClientInDomain(req: any, body: any) {
  const token = getIncomingToken(req);
  if (!token) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const url = `${config.clients.uri}${config.clients.baseRoute}`; // לדוגמה: http://domain-service:8002/api/clients
  try {
    const { data } = await axios.post(url, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return data;
  } catch (e: any) {
    const status = e?.response?.status ?? 500;
    const message =
      e?.response?.data?.message ?? e?.message ?? "clients service error";
    const err: any = new Error(message);
    err.status = status;
    throw err;
  }
}

export class AdminController {
  /**
   * A) יצירת User ע"י מנהל (ללא קישור ל-Client)
   * POST /auth/admin/create-user
   */
  static async createUser(
    req: TypedRequestWithUser<typeof adminCreateUserSchema>,
    res: Response
  ) {
    const { email, password, name, phone, address, role } = req.body;

    const existing = await UserModel.findOne({ email }).exec();
    if (existing) {
      const err: any = new Error("User already exists");
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email,
      name,
      passwordHash,
      phone,
      address,
      role: role ?? "client",
    });

    res.status(201).json({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });
  }

  /**
   * B) קישור User קיים ל-Advisor המחובר → יוצר Client
   * POST /auth/admin/link-existing-user
   */
  static async linkExistingUser(
    req: TypedRequestWithUser<typeof adminLinkExistingUserSchema>,
    res: Response
  ) {
    const advisorId = req.user.id;

    let user: MinimalUserDoc | null = null;
    if (req.body.userId)
      user = (await UserModel.findById(req.body.userId).exec()) as any;
    else if (req.body.email)
      user = (await UserModel.findOne({ email: req.body.email }).exec()) as any;

    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const client = await createClientInDomain(req, {
      userId: String(user._id),
      advisorId,
    });

    res
      .status(201)
      .json({ user: { id: String(user._id), email: user.email }, client });
  }

  /**
   * C) אורקסטרציה: מצא/צור User → צור Client וקשר למנהל
   * POST /auth/admin/create-client-with-user
   */
  static async createClientWithUser(
    req: TypedRequestWithUser<typeof adminCreateOrLinkClientSchema>,
    res: Response
  ) {
    const advisorId = req.user.id;
    const {
      userId,
      email,
      createIfMissing,
      name,
      password,
      phone,
      address,
      role,
    } = req.body;

    // 1) מצא User קיים
    let user: MinimalUserDoc | null = null;
    if (userId) user = (await UserModel.findById(userId).exec()) as any;
    if (!user && email)
      user = (await UserModel.findOne({ email }).exec()) as any;

    // 2) צור אם חסר ומותר
    if (!user && createIfMissing) {
      if (!email || !password || !name) {
        const err: any = new Error("ליצירת משתמש חדש נדרש email+password+name");
        err.status = 400;
        throw err;
      }
      const exists = (await UserModel.findOne({ email }).exec()) as any;
      if (exists) {
        user = exists;
      } else {
        const passwordHash = await bcrypt.hash(password, 10);
        user = (await UserModel.create({
          email,
          name,
          passwordHash,
          phone,
          address,
          role: role ?? "client",
        })) as any;
      }
    }

    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    // 3) צור Client בדומיין
    const client = await createClientInDomain(req, {
      userId: String(user._id),
      advisorId,
    });

    // 4) תשובה מרוכבת
    res.status(201).json({
      user: { id: String(user._id), email: user.email, role: user.role },
      client,
    });
  }
}
