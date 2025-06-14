import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema";

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

export const db = drizzle(
  `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    schema,
    casing: "snake_case",
  }
);
