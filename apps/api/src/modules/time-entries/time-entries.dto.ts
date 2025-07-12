import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Static, t } from "elysia";

import { timeEntry } from "@/db/schema";
import { ProjectResponse } from "../projects/projects.dto";
import { ProjectTaskResponse } from "../project-tasks/project-tasks.dto";

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
	id: t.Number({ default: 0 }),
});

/**
 * Select time entry with project
 */
const SelectTimeEntry = t.Object({
	...createSelectSchema(timeEntry).properties,
	// Project, nullable
	project: t.Union([ProjectResponse, t.Null()]),
	// Project task without project, nullable
	projectTask: t.Union([t.Omit(ProjectTaskResponse, ["project"]), t.Null()]),
});

/**
 * Time entry response with project data
 */
export const TimeEntryResponse = t.Omit(SelectTimeEntry, [
	"projectId",
	"userId",
	"projectTaskId",
]);

/**
 * Time entries response with project data
 */
export const TimeEntriesResponse = t.Array(TimeEntryResponse);

// Filter from date/to-date
export const TimeEntryFilter = t.Object({
	...t.Pick(t.Partial(InsertTimeEntry), ["projectId"]).properties,
	from: t.Optional(t.Date()),
	to: t.Optional(t.Date()),
});

export type TimeEntryFilterType = Static<typeof TimeEntryFilter>;

export const TimeEntryDurationByDate = t.Array(
	t.Object({
		date: t.Date(),
		duration: t.Number(),
	}),
);

console.dir(t.Date(), { depth: null });