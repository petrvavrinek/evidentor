import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

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

export * from "./auth.schema";
