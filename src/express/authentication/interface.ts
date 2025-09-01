export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  role?: "admin" | "client";
}

export interface AuthResult {
  userId: string;
  token: string;
  role: "admin" | "client";
}
