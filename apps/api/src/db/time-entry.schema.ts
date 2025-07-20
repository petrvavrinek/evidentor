import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { project } from "./project.schema";
import { projectTask } from "./project-task.schema";

export const timeEntry = pgTable(
	"time_entry",
	{
		id: integer().generatedAlwaysAsIdentity().primaryKey(),
		title: text(),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		projectId: integer().references(() => project.id, { onDelete: "set null" }),
		projectTaskId: integer().references(() => projectTask.id, {
			onDelete: "set null",
		}),
		startAt: timestamp(),
		endAt: timestamp(),
		createdAt: timestamp()
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(t) => [index("timer_entry_user_idx").on(t.userId)],
);

export const timeEntryRelations = relations(timeEntry, ({ one }) => ({
	project: one(project, {
		fields: [timeEntry.projectId],
		references: [project.id],
	}),
	projectTask: one(projectTask, {
		fields: [timeEntry.projectTaskId],
		references: [projectTask.id],
	}),
}));
