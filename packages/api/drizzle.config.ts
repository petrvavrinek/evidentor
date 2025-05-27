import { defineConfig } from "drizzle-kit";
import env from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASS,
    user: env.DB_USER,
    port: env.DB_PORT,
    ssl: false
  }
})