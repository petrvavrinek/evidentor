import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const addresses = pgTable("address", {
  id: serial("id").primaryKey(),
  streetLine1: varchar("street_line_1", { length: 255 }).notNull(),
  streetLine2: varchar("street_line_2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
