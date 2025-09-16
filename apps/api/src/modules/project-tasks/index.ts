import Elysia, { status } from "elysia";

import { BetterAuthMacro } from "../auth";
import { ProjectIdParam } from "../projects/projects.dto";
import {
	CreateProjectTask,
	ProjectTaskBetweenFilter,
	ProjectTaskCountReponse,
	ProjectTaskIdParam,
	ProjectTaskQueryFilter,
	ProjectTaskResponse,
	ProjectTasksResponse,
	UpdateProjectTask,
} from "./project-tasks.dto";
import { ProjectTasksService } from "./project-tasks.service";
import { pagination, withPagination } from "../../macros/pagination.macro";
import { injectService } from "../../macros/inject-service.macro";

const router = new Elysia({
	prefix: "/project-tasks",
	detail: { tags: ["ProjectTask"] },
})
	.use(BetterAuthMacro)
	.use(pagination)
	.use(injectService("projectTasksService", ProjectTasksService))
	.model("ProjectTask", ProjectTaskResponse)
	.model("ProjectTask[]", ProjectTasksResponse)
	.model("ProjectTaskCount", ProjectTaskCountReponse)
	.get(
		"count",
		async ({ user, query, projectTasksService }) => {
			const count = await projectTasksService.getCount(user.id, query);
			return { count };
		},
		{
			auth: true,
			query: ProjectTaskBetweenFilter,
			response: "ProjectTaskCount",
		},
	)
	.get(
		"",
		async ({ user, query, pagination, projectTasksService }) => {
			const task = await projectTasksService.findAllByUserId(user.id, query, pagination);
			return task;
		},
		{
			auth: true,
			response: "ProjectTask[]",
			query: withPagination(ProjectTaskQueryFilter),
			paginate: { defaultPageSize: 16 }
		},
	)
	.post(
		":id",
		async ({ user, body, params, projectTasksService }) => {
			const { title, description } = body;
			const { id } = params;

			const task = await projectTasksService.create(
				user.id,
				id,
				title,
				description,
			);

			// This will always be non-nullable
			const result = (await projectTasksService.findByTaskId(
				task!.id,
				user.id,
			))!;

			return result;
		},
		{
			params: ProjectIdParam,
			auth: true,
			body: CreateProjectTask,
			detail: {
				description: "Create new project task",
			},
			response: "ProjectTask",
		},
	)
	.patch(
		":id",
		async ({ user, params, body }) => {
			// TODO
		},
		{
			auth: true,
			params: ProjectTaskIdParam,
			body: UpdateProjectTask,
		},
	)
	.delete(
		":id",
		async ({ user, params, projectTasksService }) => {
			const task = await projectTasksService.findByTaskId(params.id, user.id);
			// Not found
			if (!task) throw status(404);

			// Deleted
			await projectTasksService.deleteTaskById(task.id);
			status(200);
		},
		{
			auth: true,
			detail: { description: "Delete project task by ID" },
			params: ProjectTaskIdParam,
		},
	);

export default router;
