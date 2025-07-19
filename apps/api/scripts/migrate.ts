import { LoggerService } from "@evidentor/logging";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { db } from "../src/database";

const logger = new LoggerService("migrations");

logger.info("Running migrations");

await migrate(db, {
	migrationsFolder: "./drizzle",
});

logger.info("Migrations applied");
