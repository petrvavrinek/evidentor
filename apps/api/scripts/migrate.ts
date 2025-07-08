import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "../src/database";
import logger from "../src/logger";

logger.info("Running migrations");

await migrate(db, {
  migrationsFolder: "./drizzle",
});

logger.info("Migrations applied");
