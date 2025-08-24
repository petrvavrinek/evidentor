import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { projects } from "./projects.schema";

export const projectTasks = pgTable("project_task", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	title: text().notNull(),
	projectId: integer()
		.references(() => projects.id, { onDelete: "cascade" })
		.notNull(),
	description: text(),
	createdAt: timestamp({ withTimezone: true}).defaultNow().notNull()
});

export const projectTasksRelations = relations(projectTasks, ({ one, many }) => ({
	project: one(projects, {
		fields: [projectTasks.projectId],
		references: [projects.id],
	})
}));
