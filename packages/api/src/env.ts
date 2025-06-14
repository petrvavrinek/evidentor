import "dotenv/config";

import { getSchemaValidator, t } from "elysia";

const EnvSchema = t.Object({
  IsDevelopment: t.Boolean(),
  PORT: t.Number(),
  DB_HOST: t.String(),
  DB_PORT: t.Number(),
  DB_USER: t.String(),
  DB_PASS: t.String(),
  DB_NAME: t.String(),
  GOOGLE_CLIENT_ID: t.String(),
  GOOGLE_CLIENT_SECRET: t.String(),
  CORS_ORIGINS: t.Optional(t.Array(t.String())),
});

const validator = getSchemaValidator(EnvSchema, {
  additionalProperties: true,
  coerce: true,
});

const toValidate = {
  ...process.env,
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(","),
  IsDevelopment: process.env.NODE_ENV !== "production",
};

export default validator.Decode<typeof EnvSchema.static>(toValidate);
