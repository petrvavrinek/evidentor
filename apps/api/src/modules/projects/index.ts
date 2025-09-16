import Elysia, { status } from "elysia";

import { BetterAuthMacro } from "../auth";
import { ClientsService } from "../clients/clients.service";
import {
	CreateProject,
	ProjectCountReponse,
	ProjectIdParam,
	ProjectQueryFilter,
	ProjectResponse,
	ProjectsResponse,
	UpdateProject,
} from "./projects.dto";
import { ProjectsService } from "./projects.service";
import { pagination, withPagination } from "../../macros/pagination.macro";
import { PaginationSchema } from "../../schemas/pagination.schema";
import { injectService } from "../../macros/inject-service.macro";

const router = new Elysia({
	prefix: "/projects",
	detail: { tags: ["Project"] },
})
	.use(BetterAuthMacro)
	.use(pagination)
	.use(injectService("projectsService", ProjectsService))
	.model("Project", ProjectResponse)
	.model("Project[]", ProjectsResponse)
	.model("ProjectCount", ProjectCountReponse)
	.get(
		"count",
		async ({ user, query, projectsService }) => {
			const count = await projectsService.getCount(user.id, query);
			return { count };
		},
		{
			auth: true,
			response: "ProjectCount",
			query: ProjectQueryFilter,
		},
	)
	.get(
		"",
		async ({ user, projectsService }) => {
			return projectsService.findManyByUserId(user.id);
		},
		{
			auth: true,
			detail: {
				description: "Get all user projects",
			},
			response: "Project[]",
			paginate: {
				defaultPageSize: 10
			},
			query: PaginationSchema
		},
	)
	.post(
		"",
		async (c) => {
			const { title, clientId } = c.body;
			const { user, projectsService } = c;

			// Check if client is user-defined client
			if (clientId) {
				const client = await projectsService.findById(user.id, clientId);
				if (!client) throw status(400, "Client not found");
			}

			const createdProject = await projectsService.create(user.id, {
				title,
				clientId,
			});

			const project = await projectsService.findById(
				user.id,
				createdProject!.id,
			);

			if (!project) throw status(500, "Could not create project");

			return project;
		},
		{
			auth: true,
			body: CreateProject,
			detail: {
				description: "Create new user project",
			},
			response: "Project",
		},
	)
	.get(
		":id",
		async ({ params, user, projectsService }) => {
			const { id } = params;

			const foundProject = await projectsService.findById(user.id, id);

			if (!foundProject) throw status(404, "Project not found");
			return foundProject;
		},
		{
			auth: true,
			params: ProjectIdParam,
			detail: {
				description: "Get user project by ID",
			},
			response: "Project",
		},
	)
	.patch(
		":id",
		async ({ params, body, user, projectsService }) => {
			const { id } = params;

			const updatedProject = await projectsService.updateById(
				user.id,
				id,
				body,
			);

			if (!updatedProject) return status(404, "Project not found");
			return updatedProject;
		},
		{
			auth: true,
			body: UpdateProject,
			params: ProjectIdParam,
			detail: {
				description: "Update user project data",
			},
		},
	)
	.delete(
		":id",
		async ({ params, user, projectsService }) => {
			const { id } = params;

			await projectsService.deleteById(user.id, id);
		},
		{
			auth: true,
			params: ProjectIdParam,
			detail: {
				description: "Delete user project, all time entries will be removed",
			},
		},
	);

export default router;
