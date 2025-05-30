import { pgTable, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { relations } from "drizzle-orm";

export const timeEntry = pgTable(
  "time_entry",
  {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
    title: text(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    startAt: timestamp("start_at"),
    endAt: timestamp("end_at"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (t) => [index("timer_entry_user_idx").on(t.userId)]
);

// Temp client data
export const client = pgTable("client", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const project = pgTable("project", {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  title: integer(),
  clientId: integer().references(() => client.id, { onDelete: "cascade" }),
});

export const projectRelations = relations(project, ({ one }) => ({
  client: one(project),
}));

export * from "./auth.schema";
