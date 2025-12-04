import { getEnvOrThrow } from "@kottster/common";
import { createApp, createIdentityProvider } from "@kottster/server";
import schema from "../../kottster-app.json";

/*
 * For security, consider moving the secret data to environment variables.
 * See https://kottster.app/docs/deploying#before-you-deploy
 */

const isProduction = process.env.NODE_ENV === "production";

const SECRET_KEY = getEnvOrThrow("SECRET_KEY");
const KOTTSTER_API_TOKEN = getEnvOrThrow("KOTTSTER_API_TOKEN");
const JWT_SECRET_SALT = getEnvOrThrow("JWT_SECRET_SALT");
const ROOT_USER_PASSWORD = getEnvOrThrow("ROOT_USER_PASSWORD");
const ROOT_USER_NAME = getEnvOrThrow("ROOT_USER_NAME");

export const app = createApp({
  schema,
  secretKey: SECRET_KEY,
  kottsterApiToken: KOTTSTER_API_TOKEN,

  /*
   * The identity provider configuration.
   * See https://kottster.app/docs/app-configuration/identity-provider
   */
  identityProvider: createIdentityProvider("sqlite", {
    fileName: "app.db",

    passwordHashAlgorithm: "bcrypt",
    jwtSecretSalt: JWT_SECRET_SALT,

    /* The root admin user credentials */
    rootUsername: ROOT_USER_NAME,
    rootPassword: ROOT_USER_PASSWORD,
  }),
});
