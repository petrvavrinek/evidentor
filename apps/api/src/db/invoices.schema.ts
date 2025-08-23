import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	text,
	timestamp,
	varchar
} from "drizzle-orm/pg-core";

import { user } from "./auth.schema";
import { clients } from "./clients.schema";
import { CurrencyEnum } from "./currency.schema";
import { LanguageEnum } from "./languages.schema";
import { projects } from "./projects.schema";
import { timeEntries } from "./time-entries.schema";
import { invoiceAutomationRules } from "./invoice-automation.schema";

// Invoice table
export const invoices = pgTable("invoice", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	amount: integer().notNull(),
	currency: CurrencyEnum().notNull(),
	dueDate: timestamp().notNull(),
	paidAt: timestamp(),
	sentAt: timestamp(),
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
	clientId: integer().references(() => clients.id, { onDelete: "set null" }),
	projectId: integer().references(() => projects.id, { onDelete: "set null" }),
	generatedFileId: text(),
	automationRuleId: integer().references(() => invoiceAutomationRules.id, { onDelete: "set null" }),
	language: LanguageEnum().notNull()
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
	owner: one(user, {
		fields: [invoices.ownerId],
		references: [user.id],
	}),
	items: many(invoiceItems),
	client: one(clients, {
		fields: [invoices.clientId],
		references: [clients.id]
	}),
	project: one(projects, {
		fields: [invoices.projectId],
		references: [projects.id]
	})
}));

export const invoiceItems = pgTable("invoice_item", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	timeEntryId: integer().references(() => timeEntries.id, {
		onDelete: "set null",
	}),
	name: varchar().notNull(),
	// TODO: Unsigned int
	qty: integer().notNull(),
	unitPrice: integer().notNull(),
	invoiceId: integer().references(() => invoices.id, { onDelete: "cascade" }),
});

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
	invoice: one(invoices, {
		fields: [invoiceItems.invoiceId],
		references: [invoices.id],
	}),
	timeEntry: one(timeEntries, {
		fields: [invoiceItems.timeEntryId],
		references: [timeEntries.id],
	}),
}));
