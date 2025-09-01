import env from "env-var";
import "./dotenv";

export const config = {
  service: {
    port: env.get("PORT").default(8000).asPortNumber(),
    systemUnavailableURL: env
      .get("SYSTEM_UNAVAILABLE_URL")
      .default("http://localhost:8000/unavailable")
      .asString(),
    maxFileSize: env.get("MAX_FILE_SIZE").default(50_000_000).asInt(),
    requestTimeout: env.get("REQUEST_TIMEOUT").default(10_000).asIntPositive(),
  },
  mongo: {
    uri: env
      .get("MONGO_URI")
      .default("mongodb://localhost:27017/smart-docs")
      .asString(),
    usersCollectionName: env
      .get("USERS_COLLECTION_NAME")
      .default("users")
      .asString(),
  },
  authentication: {
    baseRoute: env.get("AUTHENTICATION_BASE_ROUTE").default("/auth").asString(),
    callbackURL: env
      .get("CALLBACK_URL")
      .default("http://localhost:8000/api/auth/callback")
      .asString(),
    sessionSecret: env.get("SESSION_SECRET").default("secret").asString(),
    secret: env.get("SECRET_KEY").default("secret@1234").asString(),
    expiresIn: env.get("ACCESS_TOKEN_EXPIRATION_TIME").default("1d").asString(),
  },
  cookie: {
    httpOnly: env.get("AUTH_COOKIE_HTTP_ONLY").default("true").asBool(),
    secure: env.get("AUTH_COOKIE_SECURE").default("false").asBool(),
    sameSite: env
      .get("AUTH_COOKIE_SAME_SITE")
      .default("lax")
      .asEnum(["lax", "strict", "none"]),
    maxAge: env.get("AUTH_COOKIE_MAX_AGE").default(86400000).asInt(),
    name: env.get("AUTH_COOKIE_NAME").default("auth_token").asString(),
  },

  // === Gateways ===
  // אם clients/cases/templates על אותו הוסט (8001)
  clients: {
    uri: env
      .get("CLIENTS_SERVICE_URI")
      .default("http://localhost:8001")
      .asString(),
    baseRoute: env.get("CLIENTS_BASE_ROUTE").default("/api/clients").asString(),
  },
  cases: {
    uri: env
      .get("CASES_SERVICE_URI")
      .default("http://localhost:8001")
      .asString(),
    baseRoute: env.get("CASES_BASE_ROUTE").default("/api/cases").asString(),
  },
  templates: {
    uri: env
      .get("TEMPLATES_SERVICE_URI")
      .default("http://localhost:8001")
      .asString(),
    baseRoute: env
      .get("TEMPLATES_BASE_ROUTE")
      .default("/api/templates")
      .asString(),
  },
  documents: {
    uri: env
      .get("DOCUMENTS_SERVICE_URI")
      .default("http://localhost:8002")
      .asString(),
    baseRoute: env
      .get("DOCUMENTS_BASE_ROUTE")
      .default("/api/documents")
      .asString(),
  },
};
