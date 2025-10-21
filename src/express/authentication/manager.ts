import { registerUserSchema, loginUserSchema } from "./validations";
// import { getUserByEmail, createUser } from "../users/service";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "../../config/config";
import { IUser, UserDocument } from "../users/interface";
import UserModel from "../users/model";
import { ServiceError } from "../../utils/errors";
import { AuthResult, RegisterInput } from "./interface";

export class AuthenticationManager {
  static async register(userData: RegisterInput): Promise<AuthResult> {
    const existing = await UserModel.findOne({ email: userData.email });
    if (existing) {
      throw ServiceError.userAlreadyExists(); // 400
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await UserModel.create({
      email: userData.email,
      passwordHash: hashedPassword,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      role: "client",
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.authentication.secret,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      }
    );

    return {
      userId: user._id.toString(),
      token,
      role: user.role,
    };
  }
  static async login(email: string, password: string): Promise<AuthResult> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ServiceError.userNotFound(); // 404
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw ServiceError.invalidEmailOrPassword();
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.authentication.secret,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      }
    );
    return {
      userId: user._id.toString(),
      token,
      role: user.role,
    };
  }
}
