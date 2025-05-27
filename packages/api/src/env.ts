import "dotenv/config";

import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvSchema = Type.Object({
  IsDevelopment: Type.Boolean({
    default: process.env.NODE_ENV !== "production",
  }),
});

export default Value.Parse(EnvSchema, process.env);
