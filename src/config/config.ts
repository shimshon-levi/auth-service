import env from "env-var";
import "./dotenv";
export const config = {
  service: {
    port: env.get("PORT").default(8000).asPortNumber(),
    systemUnavailableURL: env
      .get("SYSTEM_UNAVAILABLE_URL")
      .default("http://localhost:8000/unavailable")
      .asString(),
    maxFileSize: env.get("MAX_FILE_SIZE").default(50000000).asInt(),
  },
  mongo: {
    uri: env
      .get("MONGO_URI")
      .default("mongodb://localhost/smart-docs")
      .required()
      .asString(),
    usersCollectionName: env
      .get("USERS_COLLECTION_NAME")
      .default("users")
      .required()
      .asString(),
  },

  authentication: {
    baseRoute: env
      .get("AUTHENTICATION_BASE_ROUTE")
      .default("/api/auth")
      .asString(),
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
    secure: env.get("AUTH_COOKIE_SECURE").default("false").asBool(), // true בפרודקשן
    sameSite: env
      .get("AUTH_COOKIE_SAME_SITE")
      .default("lax")
      .asEnum(["lax", "strict", "none"]),
    maxAge: env.get("AUTH_COOKIE_MAX_AGE").default(86400000).asInt(), // 1 יום = 24*60*60*1000
    name: env.get("AUTH_COOKIE_NAME").default("auth_token").asString(),
  },
};
