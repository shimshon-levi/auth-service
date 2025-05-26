export interface IUser {
  email: string;
  fullName?: string;
  password: string;
  phone?: string;
  address?: string;
  role?: "admin" | "client";
  createdAt?: Date;
}

export interface UserDocument extends IUser {
  _id: string;
}
