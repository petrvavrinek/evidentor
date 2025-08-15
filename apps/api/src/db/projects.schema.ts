import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { clients } from "./clients.schema";

export const projects = pgTable("project", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	title: text(),
	ownerId: text().references(() => user.id, { onDelete: "cascade" }),
	clientId: integer().references(() => clients.id, { onDelete: "cascade" }),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
	client: one(clients, {
		fields: [projects.clientId],
		references: [clients.id],
	}),
	owner: one(user, {
		fields: [projects.ownerId],
		references: [user.id],
	}),
}));
