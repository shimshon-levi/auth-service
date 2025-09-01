import { Router } from "express";
import { config } from "../../config/config";
import { authMiddleware } from "../../utils/authMiddleware";
import { requireAdmin } from "../../utils/requireAdmin";
import UserModel from "./model";
import { wrapProxy } from "../../utils/express/wrappers";

// const {
//   users: { uri },
// } = config;

export const usersAdminRouter = Router();

usersAdminRouter.use(authMiddleware, requireAdmin);

// usersAdminRouter.patch("/:id/role",
//   const { role } = req.body; // "admin" | "client"
//   if (!["admin", "client"].includes(role)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }
//   const updated = await UserModel.findByIdAndUpdate(
//     req.params.id,
//     { role },
//     { new: true }
//   );
//   if (!updated) return res.status(404).json({ message: "User not found" });
//   res.json({ userId: updated._id, role: updated.role });
// });

export const usersRouter = Router();

// usersRouter.all("*", wrapProxy(uri));
