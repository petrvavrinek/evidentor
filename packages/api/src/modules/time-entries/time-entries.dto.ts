import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

import { timeEntry } from "@/db/schema";
import { ProjectResponse } from "../projects/projects.dto";

/**
 * Base time entry insert schema with refined values
 */
const InsertTimeEntry = createInsertSchema(timeEntry, {
  startAt: t.Date(),
  endAt: t.Nullable(t.Optional(t.Date())),
  title: t.String(),
  projectId: t.Nullable(t.Optional(t.Number())),
});

/**
 * Create time entry schema
 */
export const CreateTimeEntry = t.Omit(InsertTimeEntry, ["userId", "createdAt"]);

/**
 * Update time entry schema
 */
export const UpdateTimeEntry = t.Partial(CreateTimeEntry);

/**
 * Time entry ID schema (used for query or path parameters)
 */
export const TimeEntryIdParam = t.Object({
  id: t.Number(),
});


/**
 * Select time entry with project
 */
const SelectTimeEntry = t.Object({
  ...createSelectSchema(timeEntry).properties,
  project: t.Union([ProjectResponse, t.Null()]),
});

/**
 * Time entry response with project data
 */
export const TimeEntryResponse = t.Omit(SelectTimeEntry, ["projectId", "userId"]);

/**
 * Time entries response with project data
 */
export const TimeEntriesResponse = t.Array(TimeEntryResponse);
