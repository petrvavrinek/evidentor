import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { projects } from "./projects.schema";
import { projectTasks } from "./project-tasks.schema";
import { invoices } from "./invoices.schema";

export const timeEntries = pgTable(
	"time_entry",
	{
		id: integer().generatedAlwaysAsIdentity().primaryKey(),
		title: text(),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		projectId: integer().references(() => projects.id, { onDelete: "set null" }),
		projectTaskId: integer().references(() => projectTasks.id, {
			onDelete: "set null",
		}),
		invoiceId: integer().references(() => invoices.id),
		startAt: timestamp({ withTimezone: true }),
		endAt: timestamp({ withTimezone: true }),
		createdAt: timestamp({ withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(t) => [index("timer_entry_user_idx").on(t.userId)],
);

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
	project: one(projects, {
		fields: [timeEntries.projectId],
		references: [projects.id],
	}),
	projectTask: one(projectTasks, {
		fields: [timeEntries.projectTaskId],
		references: [projectTasks.id],
	}),
	invoice: one(invoices, {
		fields: [timeEntries.invoiceId],
		references: [invoices.id]
	})
}));
