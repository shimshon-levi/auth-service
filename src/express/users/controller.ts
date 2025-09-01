import { Response } from "express";
import { updateUserRole } from "./manager";
import { TypedRequest } from "../../utils/zod";
import { updateUserRoleSchema } from "./validations";

export class UsersAdminController {
  static async updateRole(
    req: TypedRequest<typeof updateUserRoleSchema>,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await updateUserRole(id, role);
    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return; // חשוב: שלא נחזיר Response (שיתאים ל-Promise<void>)
    }

    res.json({ userId: updated._id, role: updated.role });
  }
}
