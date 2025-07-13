import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { client } from "./client.schema";

export const project = pgTable("project", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	title: text(),
	ownerId: text().references(() => user.id, { onDelete: "cascade" }),
	clientId: integer().references(() => client.id, { onDelete: "cascade" }),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
});

export const projectRelations = relations(project, ({ one }) => ({
	client: one(client, {
		fields: [project.clientId],
		references: [client.id],
	}),
	owner: one(user, {
		fields: [project.ownerId],
		references: [user.id],
	}),
}));
