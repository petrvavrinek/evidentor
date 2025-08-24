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
export const calendars = pgTable("calendar", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: text()
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	name: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
});

/**
 * Calendar event
 */
export const calendarEvents = pgTable("calendar_event", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: varchar().notNull(),
	description: text(),
	calendarId: integer()
		.references(() => calendars.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	startAt: timestamp({ withTimezone: true }).notNull(),
	endAt: timestamp({ withTimezone: true }),
});
