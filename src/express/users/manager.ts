import UserModel from "./model";
import { IUser } from "./interface";

export const createUser = async (userData: IUser) => {
  const user = new UserModel(userData);
  return await user.save();
};

export const getUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};
