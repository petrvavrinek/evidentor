import { pgTable, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const timeEntry = pgTable(
  "time_entry",
  {
    id: integer().generatedAlwaysAsIdentity().primaryKey(),
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

export * from "./auth.schema";
