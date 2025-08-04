import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

/**
 * User-defined calendar
 */
export const calendar = pgTable("calendar", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text()
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	name: varchar().notNull(),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
});

/**
 * Calendar event
 */
export const calendarEvent = pgTable("calendar_event", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: varchar().notNull(),
	description: text(),
	calendarId: integer()
		.references(() => calendar.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
	startAt: timestamp().notNull(),
	endAt: timestamp(),
});
