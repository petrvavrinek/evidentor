import "dotenv/config";

import { getSchemaValidator, t } from "elysia";

const IsDevelopmentMode = process.env.NODE_ENV !== "production";

const EnvSchema = t.Object({
  IsDevelopment: t.Optional(t.Boolean({ default: IsDevelopmentMode })),
  PORT: t.Number(),
  DB_HOST: t.String(),
  DB_PORT: t.Number(),
  DB_USER: t.String(),
  DB_PASS: t.String(),
  DB_NAME: t.String(),
  GOOGLE_CLIENT_ID: t.String(),
  GOOGLE_CLIENT_SECRET: t.String()
});

const validator = getSchemaValidator(EnvSchema, {
  additionalProperties: true,
  coerce: true,
});

export default validator.Decode<typeof EnvSchema.static>(process.env);
