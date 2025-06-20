import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

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
