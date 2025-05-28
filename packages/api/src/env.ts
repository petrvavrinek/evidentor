import "dotenv/config";

import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
  IsDevelopment: Type.Boolean({
    default: process.env.NODE_ENV !== "production",
  }),
  PORT: Type.Number({ default: process.env.PORT ?? 3000 }),
  DB_HOST: Type.String(),
  DB_PORT: Type.Number({ default: process.env.DB_PORT }),
  DB_USER: Type.String(),
  DB_PASS: Type.String(),
  DB_NAME: Type.String(),
});

export default Value.Parse(EnvSchema, process.env);
