import { and, count, eq, getTableColumns, gte, lte, SQL } from "drizzle-orm";

import { clients, projects, projectTasks } from "@/db/schema";
import { db } from "../../database";
import { ProjectsService } from "../projects/projects.service";
import type {
	ProjectTaskBetweenFilterType,
	ProjectTaskFilter,
	ProjectTaskResponseType,
} from "./project-tasks.dto";
import type { Pagination, PaginationInput } from "../../schemas/pagination.schema";
import { Inject, Service } from "typedi";

@Service()
export class ProjectTasksService {

	constructor(@Inject() private readonly projectsService: ProjectsService) {

	}

	async findByOptions(userId: string, filter?: ProjectTaskFilter & { where?: SQL[] }, pagination?: PaginationInput): Promise<ProjectTaskResponseType[]> {
		const filters: SQL[] = [eq(projects.ownerId, userId)]

		if (filter?.project)
			filters.push(eq(projects.id, filter.project));

		const query = db
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
			.where(and(...filters, ...(filter?.where ?? [])))
			.$dynamic();

		if (pagination?.skip) query.offset(pagination.skip);
		if (pagination?.take) query.limit(pagination.take);

		return (await query.execute()) as ProjectTaskResponseType[];
	}

	/**
	 * Find all user tasks
	 * @param userId
	 * @returns
	 */
	findAllByUserId(
		userId: string,
		filter?: ProjectTaskFilter,
		pagination?: PaginationInput
	): Promise<ProjectTaskResponseType[]> {
		return this.findByOptions(userId, filter, pagination);
	}

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
		const project = await this.projectsService.findById(userId, projectId);

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
	}

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
		const task = await this.findByOptions(userId, { where: [eq(projectTasks.id, id)] })
		return task[0] ?? null;
	}

	/**
	 * Delete project task by ID
	 * @param id Project task ID
	 */
	async deleteTaskById(id: number) {
		await db.delete(projectTasks).where(eq(projectTasks.id, id));
	}

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
	}
};
