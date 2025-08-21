import { and, count, eq, getTableColumns, gte, lte } from "drizzle-orm";

import { clients, projects, projectTasks } from "@/db/schema";
import { db } from "../../database";
import { ProjectsService } from "../projects/projects.service";
import type {
	ProjectTaskBetweenFilterType,
	ProjectTaskFilter,
	ProjectTaskResponseType,
} from "./project-tasks.dto";
import type { Pagination } from "../../schemas/pagination.schema";

export const ProjectTasksService = {
	/**
	 * Select query builder to include all necessary columns
	 * @returns
	 */
	getSelectQueryBuilder(userId: string) {
		return db
			.select({
				...getTableColumns(projectTasks),
				project: {
					...getTableColumns(projects),
					// @ts-ignore
					client: {
						...getTableColumns(clients),
					},
				},
			})
			.from(projectTasks)
			.leftJoin(projects, eq(projectTasks.projectId, projects.id))
			.innerJoin(clients, eq(clients.id, projects.clientId))
			.$dynamic()
			.where(eq(projects.ownerId, userId));
	},

	/**
	 * Find all user tasks
	 * @param userId
	 * @returns
	 */
	async findAllByUserId(
		userId: string,
		filter?: ProjectTaskFilter
	): Promise<ProjectTaskResponseType[]> {
		let query = this.getSelectQueryBuilder(userId);

		if (filter?.project)
			query = query.where(eq(projectTasks.projectId, filter.project));

		return (await query) as ProjectTaskResponseType[];
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
			eq(projects.id, projectId),
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
			.insert(projectTasks)
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
			eq(projectTasks.id, id),
		);
		if (!task[0]) return null;
		return task[0] as never as ProjectTaskResponseType;
	},

	/**
	 * Delete project task by ID
	 * @param id Project task ID
	 */
	async deleteTaskById(id: number) {
		await db.delete(projectTasks).where(eq(projectTasks.id, id));
	},

	/**
	 * Count user tasks by filter
	 * @param userId User ID
	 * @param filter Filter to
	 * @returns Number of tasks
	 */
	async getCount(
		userId: string,
		filter?: ProjectTaskBetweenFilterType,
	): Promise<number> {
		const filters = [];

		if (filter?.project) filters.push(eq(projects.id, filter.project));
		if (filter?.from) filters.push(gte(projectTasks.createdAt, filter.from));
		if (filter?.to) filters.push(lte(projectTasks.createdAt, filter.to));

		const query = db
			.select({ count: count() })
			.from(projectTasks)
			.leftJoin(projects, eq(projectTasks.projectId, projects.id))
			.where(and(eq(projects.ownerId, userId), ...filters));

		const r = await query;
		return r[0]?.count ?? 0;
	},
};
