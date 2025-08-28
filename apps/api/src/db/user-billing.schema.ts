import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { addresses } from "./address.schema";
import { relations } from "drizzle-orm";
import { clients } from "./clients.schema";
import { CurrencyEnum } from "./currency.schema";

export const userBilling = pgTable("user_billing", {
  userId: text().primaryKey().references(() => user.id),
  addressId: integer().references(() => addresses.id, { onDelete: "cascade" }).notNull(),
  bankAccount: text().notNull(),
  companyName: text().notNull(),
  companyId: text().notNull(), // ičo
  vatNumber: text(), // dič
  vatPayer: boolean().default(false),
  // iban: varchar({ length: 34 }).notNull().default(""),
});

export const userBillingRelations = relations(userBilling, ({ one }) => ({
  address: one(addresses, {
    fields: [userBilling.addressId],
    references: [addresses.id],
  })
}));

export const userClientBilling = pgTable("user_client_biling", {
  id: serial().primaryKey(),
  userId: text().references(() => user.id, { onDelete: "cascade" }).notNull(),
  clientId: integer().references(() => clients.id, { onDelete: "cascade" }).notNull(),
  currency: CurrencyEnum().notNull(),
  hourlyRate: integer().notNull()
})