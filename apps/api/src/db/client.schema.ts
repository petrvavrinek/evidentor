import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";

// Temp client data
export const client = pgTable("client", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	companyName: text().notNull(),
	contactName: text().notNull(),
	email: text(),
	ownerId: text().references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
});
