import Elysia, { status } from "elysia";
import { betterAuth } from "../../auth/index";
import {
	CreateProject,
	ProjectCountReponse,
	ProjectIdParam,
	ProjectQueryFilter,
	ProjectResponse,
	ProjectsResponse,
	UpdateProject,
} from "./projects.dto";

import { ClientsService } from "../clients/clients.service";
import { ProjectsService } from "./projects.service";

export const router = new Elysia({
	prefix: "/project",
	detail: { tags: ["Project"] },
})
	.use(betterAuth)
	.model("Project", ProjectResponse)
	.model("Project[]", ProjectsResponse)
	.model("ProjectCount", ProjectCountReponse)
	.get(
		"count",
		async ({ user, query }) => {
			const count = await ProjectsService.getCount(user.id, query);
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
		async ({ user }) => {
			return ProjectsService.findManyByUserId(user.id);
		},
		{
			auth: true,
			detail: {
				description: "Get all user projects",
			},
			response: "Project[]",
		},
	)
	.post(
		"",
		async (c) => {
			const { title, clientId } = c.body;
			const { user } = c;

			// Check if client is user-defined client
			if (clientId) {
				const client = await ClientsService.findById(user.id, clientId);
				if (!client) throw status(400, "Client not found");
			}

			const { id } = await ProjectsService.create(user.id, {
				title,
				clientId,
			});

			const project = await ProjectsService.findById(user.id, id);

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
		async ({ params, user }) => {
			const { id } = params;

			const foundProject = await ProjectsService.findById(user.id, id);

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
		async ({ params, body, user }) => {
			const { id } = params;

			const updatedProject = await ProjectsService.updateById(
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
		async ({ params, user }) => {
			const { id } = params;

			await ProjectsService.deleteById(user.id, id);
		},
		{
			auth: true,
			params: ProjectIdParam,
			detail: {
				description: "Delete user project, all time entries will be removed",
			},
		},
	);
