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
import { clients } from "./clients.schema";
import { projects } from "./projects.schema";
import { projectTasks } from "./project-tasks.schema";

// Available currencies
// TODO: Maybe move this to some config?
export const Currencies = ["czk", "eur", "usd"] as const;
export type Currency = (typeof Currencies)[number];

export const CurrencyEnum = pgEnum("currency", Currencies);

// Invoice table
export const invoices = pgTable("invoice", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	clientId: integer().references(() => clients.id, { onDelete: "set null" }),
	projectId: integer().references(() => projects.id, { onDelete: "set null" }),
	amount: integer().notNull(),
	currency: CurrencyEnum().notNull(),
	dueDate: timestamp(),
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
});

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
	client: one(clients, {
		fields: [invoices.clientId],
		references: [clients.id],
	}),
	project: one(projects, {
		fields: [invoices.projectId],
		references: [projects.id],
	}),
	owner: one(user, {
		fields: [invoices.ownerId],
		references: [user.id],
	}),
	items: many(invoiceItems),
}));

export const invoiceItems = pgTable("invoice_item", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	projectTaskId: integer().references(() => projectTasks.id, {
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
	projectTask: one(projectTasks, {
		fields: [invoiceItems.projectTaskId],
		references: [projectTasks.id],
	}),
}));
