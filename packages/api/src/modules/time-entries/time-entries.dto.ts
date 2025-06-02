import { t } from "elysia";
import { timeEntry } from "../../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const CreateTimeEntry = createInsertSchema(timeEntry, {
  startAt: t.Date(),
  endAt: t.Nullable(t.Optional(t.Date())),
  title: t.String(),
  projectId: t.Nullable(t.Optional(t.Number())),
});

export const UpdateTimeEntry = t.Partial(CreateTimeEntry);

export const TimeEntryIdParam = t.Object({
  id: t.Number(),
});

export const TimeEntryResponse = createSelectSchema(timeEntry);
