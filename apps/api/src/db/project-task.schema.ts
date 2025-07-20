import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { project } from "./project.schema";

export const projectTask = pgTable("project_task", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	title: text().notNull(),
	projectId: integer()
		.references(() => project.id, { onDelete: "cascade" })
		.notNull(),
	description: text(),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
});

export const projectTaskRelations = relations(projectTask, ({ one }) => ({
	project: one(project, {
		fields: [projectTask.projectId],
		references: [project.id],
	}),
}));
