// import { Request, Response } from "express";
// import { registerUserSchema, loginUserSchema } from "./validations";
// import { createUser, getUserByEmail } from "./manager";
// import bcrypt from "bcryptjs";

// export const register = async (req: Request, res: Response) => {
//   try {
//     const parsed = registerUserSchema.parse(req.body);
//     const existingUser = await getUserByEmail(parsed.email);
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(parsed.password, 10);
//     const newUser = await createUser({ ...parsed, password: hashedPassword });
//     res.status(201).json({ id: newUser._id, email: newUser.email });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid data", error: err });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   try {
//     const parsed = loginUserSchema.parse(req.body);
//     const user = await getUserByEmail(parsed.email);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(parsed.password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // TODO: JWT generation
//     res.status(200).json({ message: "Login successful", userId: user._id });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid data", error: err });
//   }
// };
