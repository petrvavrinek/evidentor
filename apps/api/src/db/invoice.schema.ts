import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { client } from "./client.schema";
import { project } from "./project.schema";

// Available currencies
// TODO: Maybe move this to some config?
export const Currencies = ["czk", "eur", "usd"] as const;
export type Currency = (typeof Currencies)[number];

export const CurrencyEnum = pgEnum("currency", Currencies);

// Invoice table
export const invoice = pgTable("invoice", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	clientId: integer().references(() => client.id, { onDelete: "set null" }),
	projectId: integer().references(() => project.id, { onDelete: "set null" }),
	amount: integer().notNull(),
	status: text().$type<"draft" | "sent" | "paid" | "overdue">().notNull(),
	currency: CurrencyEnum().notNull(),
	dueDate: timestamp(),
	issuedAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
	createdAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp()
		.$defaultFn(() => new Date())
		.notNull(),
	ownerId: text().references(() => user.id, { onDelete: "cascade" }),
});

export const invoiceRelations = relations(invoice, ({ one }) => ({
	client: one(client, {
		fields: [invoice.clientId],
		references: [client.id],
	}),
	project: one(project, {
		fields: [invoice.projectId],
		references: [project.id],
	}),
	owner: one(user, {
		fields: [invoice.ownerId],
		references: [user.id],
	}),
}));

export const invoiceItem = pgTable("invoice_item", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	name: varchar().notNull(),
	// TODO: Unsigned int
	qty: integer().notNull(),
	unitPrice: integer().notNull(),
	invoiceId: integer().references(() => invoice.id, { onDelete: "cascade" }),
});

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
	invoice: one(invoice, {
		fields: [invoiceItem.invoiceId],
		references: [invoice.id],
	}),
}));
