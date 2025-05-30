import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema";
import env from "./env";

export const db = drizzle(
  `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  {
    schema,
  }
);
