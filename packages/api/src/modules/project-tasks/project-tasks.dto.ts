import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";

import { projectTask } from "@/db/schema";
import { ProjectResponse } from "../projects/projects.dto";

const InsertProjectTask = createInsertSchema(projectTask);

/**
 * Create project task schema
 */
export const CreateProjectTask = t.Pick(InsertProjectTask, [
	"title",
	"description",
]);

/**
 * Update project task schema
 */
export const UpdateProjectTask = t.Partial(CreateProjectTask);

/**
 * Project task parameter
 */
export const ProjectTaskIdParam = t.Object({
	id: t.Number(),
});

/**
 * Select project task schema
 */
const SelectProjectTask = t.Object({
	id: t.Number(),
	...createSelectSchema(projectTask).properties,
	project: ProjectResponse,
});

/**
 * Project task response
 */
export const ProjectTaskResponse = t.Omit(SelectProjectTask, ["projectId"]);

/**
 * Project task response
 */
export const ProjectTasksResponse = t.Array(ProjectTaskResponse);

/**
 * ProjectTaskResponse type because there is no way to select nested object that are inferred into return type
 */
export type ProjectTaskResponseType = Static<typeof ProjectTaskResponse>;

export const ProjectTaskQueryFilter = t.Partial(
	t.Object({
		project: t.Number(),
	}),
);

export type ProjectTaskFilter = Static<typeof ProjectTaskQueryFilter>;