import Elysia, { status } from "elysia";
import { betterAuth } from "../../auth";
import { ProjectIdParam } from "../projects/projects.dto";
import {
	CreateProjectTask,
	ProjectTaskIdParam,
	ProjectTaskQueryFilter,
	ProjectTaskResponse,
	ProjectTasksResponse,
	UpdateProjectTask,
} from "./project-tasks.dto";
import { ProjectTasksService } from "./project-tasks.service";


export const router = new Elysia({
	prefix: "/project-task",
	detail: { tags: ["ProjectTask"] },
})
	.use(betterAuth)
	.model("ProjectTask", ProjectTaskResponse)
	.model("ProjectTask[]", ProjectTasksResponse)
	.get(
		"",
		async ({ user, query }) => {
			const task = await ProjectTasksService.findAllByUserId(user.id, query);
			return task;
		},
		{ auth: true, response: "ProjectTask[]", query: ProjectTaskQueryFilter },
	)
	.post(
		":id",
		async ({ user, body, params }) => {
			const { title, description } = body;
			const { id } = params;

			const task = await ProjectTasksService.create(
				user.id,
				id,
				title,
				description,
			);

			// This will always be non-nullable
			const result = (await ProjectTasksService.findByTaskId(task.id, user.id))!;

			console.dir(result, { depth: null });
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
		async ({ user, params }) => {
			const task = await ProjectTasksService.findByTaskId(params.id, user.id);
			// Not found
			if (!task) throw status(404);

			// Deleted
			await ProjectTasksService.deleteTaskById(task.id);
			status(200);
		},
		{
			auth: true,
			detail: { description: "Delete project task by ID" },
			params: ProjectTaskIdParam,
		},
	);
