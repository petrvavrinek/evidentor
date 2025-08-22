import { boolean, integer, pgTable, serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { addresses } from "./address.schema";
import { relations } from "drizzle-orm";

// Temp client data
export const clients = pgTable("client", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	companyName: text().notNull(),
	contactName: text().notNull(),
	email: text(),
	ownerId: text().references(() => user.id, { onDelete: "cascade" }),
	addressId: integer().references(() => addresses.id, { onDelete: "set null" }),
	companyId: text(), // ičo
	vatNumber: text(), // dič
	vatPayer: boolean().default(false),
	createdAt: timestamp({ withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const clientsRelations = relations(clients, ({ one }) => ({
	address: one(addresses, {
		fields: [clients.addressId],
		references: [addresses.id],
	}),
}));

