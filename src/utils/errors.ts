export class ServiceError extends Error {
  constructor(public code: number, message: string, public metadata?: object) {
    super(message);
    this.name = "ServiceError";
  }

  static documentNotFound(id: string) {
    return new ServiceError(404, `No systems found with id ${id}`);
  }

  static invalidToken() {
    return new ServiceError(401, "Invalid token");
  }

  static invalidEmailOrPassword() {
    return new ServiceError(401, "Invalid email or password");
  }
  static userAlreadyExists() {
    return new ServiceError(400, "User already exists");
  }

  static userNotFound() {
    return new ServiceError(404, "User not found");
  }

  static userNotAdmin() {
    return new ServiceError(403, "User is not admin");
  }

  static usersFetchError() {
    return new ServiceError(503, "Failed to fetch users from Kartoffel");
  }
}
