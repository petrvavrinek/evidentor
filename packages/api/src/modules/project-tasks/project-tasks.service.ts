import { eq, getTableColumns } from "drizzle-orm";

import { client, project, projectTask } from "@/db/schema";
import { db } from "../../database";
import { ProjectsService } from "../projects/projects.service";
import type { ProjectTaskFilter, ProjectTaskResponseType } from "./project-tasks.dto";

export const ProjectTasksService = {
	/**
	 * Select query builder to include all necessary columns
	 * @returns
	 */
	getSelectQueryBuilder(userId: string) {
		return db
			.select({
				...getTableColumns(projectTask),
				project: {
					...getTableColumns(project),
					// @ts-ignore
					client: {
						...getTableColumns(client),
					},
				},
			})
			.from(projectTask)
			.leftJoin(project, eq(projectTask.projectId, project.id))
			.innerJoin(client, eq(client.id, project.clientId))
			.$dynamic()
			.where(eq(project.ownerId, userId));
	},

	/**
	 * Find all user tasks
	 * @param userId
	 * @returns
	 */
	async findAllByUserId(userId: string, filter?: ProjectTaskFilter): Promise<ProjectTaskResponseType[]> {
		let query = this.getSelectQueryBuilder(userId);

		if(filter?.project)
			query = query.where(eq(projectTask.projectId, filter.project));

		return await query as ProjectTaskResponseType[];
	},

	/**
	 * Find all user project tasks
	 * @param userId User ID
	 * @returns Array of tasks
	 */

	async findByUserAndProjectId(
		userId: string,
		projectId: number,
	): Promise<ProjectTaskResponseType[]> {
		const tasks = await this.getSelectQueryBuilder(userId).where(
			eq(project.id, projectId),
		);

		return tasks as ProjectTaskResponseType[];
	},

	/**
	 * Create new task for project
	 * @param userId User ID
	 * @param projectId Project ID
	 * @param title Task title
	 * @param description Task description
	 * @returns Created task
	 */
	async create(
		userId: string,
		projectId: number,
		title: string,
		description?: string | null,
	) {
		const project = await ProjectsService.findById(userId, projectId);

		if (!project) throw `Project not found`;

		const [task] = await db
			.insert(projectTask)
			.values({
				title: title,
				description,
				projectId: project.id,
			})
			.returning();

		return task;
	},

	/**
	 * Find task by ID
	 * @param id Task ID
	 * @param userId User ID
	 * @returns Project task or null
	 */
	async findByTaskId(
		id: number,
		userId: string,
	): Promise<ProjectTaskResponseType | null> {
		const task = await this.getSelectQueryBuilder(userId).where(
			eq(projectTask.id, id),
		);
		return task as never as ProjectTaskResponseType;
	},

	/**
	 * Delete project task by ID
	 * @param id Project task ID
	 */
	async deleteTaskById(id: number) {
		await db.delete(projectTask).where(eq(projectTask.id, id));
	},
};
