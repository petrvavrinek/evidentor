import { integer, pgTable, serial, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";

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
	createdAt: timestamp({ withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const clientsBilling = pgTable("client_billing", {
	id: serial("id").primaryKey(),
	clientId: integer().notNull().unique().references(() => clients.id),
	accountNumber: varchar({ length: 255 }).notNull(),
	iban: varchar({ length: 34 }),
	swiftCode: varchar({ length: 11 }),
	variableSymbol: varchar({ length: 10 }),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const clientsRelations = relations(clients, ({ one }) => ({
	billing: one(clientsBilling, {
		fields: [clients.id],
		references: [clientsBilling.clientId],
	}),
	address: one(addresses, {
		fields: [clients.addressId],
		references: [addresses.id],
	}),
}));

