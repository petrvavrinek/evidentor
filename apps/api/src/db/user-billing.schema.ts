import { boolean, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { addresses } from "./address.schema";
import { relations } from "drizzle-orm";

export const userBilling = pgTable("user_billing", {
  userId: text().primaryKey().references(() => user.id),
  addressId: integer().references(() => addresses.id).notNull(),
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