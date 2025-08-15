import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";

import { projects } from "@/db/schema";

import { ClientResponseSchema } from "../clients/clients.schema";

const InsertProject = createInsertSchema(projects);

/**
 * Create project schema
 */
export const CreateProject = t.Pick(InsertProject, ["clientId", "title"]);

/**
 * Update project schema
 */
export const UpdateProject = t.Partial(CreateProject);

/**
 * Project ID parameter
 */
export const ProjectIdParam = t.Object({
  id: t.Number(),
});

/**
 * Select project schema
 */
const SelectProject = t.Object({
  ...createSelectSchema(projects).properties,
  client: t.Nullable(ClientResponseSchema),
});

/**
 * Project response
 */
export const ProjectResponse = t.Omit(SelectProject, ["ownerId", "clientId"]);

/**
 * Project response
 */
export const ProjectsResponse = t.Array(ProjectResponse);

export const ProjectQueryFilter = t.Object({
  client: t.Optional(t.Number({ default: 0 })),
  from: t.Optional(t.Date()),
  to: t.Optional(t.Date())
})

export type ProjectQueryFilterType = Static<typeof ProjectQueryFilter>;

export const ProjectCountReponse = t.Object({
	count: t.Number(),
});
