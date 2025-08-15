import { and, count, eq, gte, lte } from "drizzle-orm";
import { db } from "../../database";
import { projects } from "../../db/schema";
import type { ProjectQueryFilterType } from "./projects.dto";

type Project = typeof projects.$inferInsert;

export const ProjectsService = {
	findManyByUserId(userId: string) {
		return db.query.projects.findMany({
			where: eq(projects.ownerId, userId),
			with: {
				client: true,
			},
		});
	},

	findById(userId: string, id: number) {
		return db.query.projects.findFirst({
			where: and(eq(projects.ownerId, userId), eq(projects.id, id)),
			with: {
				client: true,
			},
		});
	},

	async create(userId: string, data: Project) {
		const [createdProject] = await db
			.insert(projects)
			.values({
				...data,
				ownerId: userId,
			})
			.returning();
		return createdProject;
	},

	async updateById(userId: string, id: number, data: Partial<Project>) {
		const updatedProject = await db
			.update(projects)
			.set(data)
			.where(and(eq(projects.id, id), eq(projects.ownerId, userId)))
			.returning();

		return updatedProject[0] ?? null;
	},

	deleteById(userId: string, id: number) {
		return db
			.delete(projects)
			.where(and(eq(projects.id, id), eq(projects.ownerId, userId)))
			.returning();
	},

	async getCount(
		userId: string,
		filter?: ProjectQueryFilterType,
	): Promise<number> {
		const filters = [];

		if (filter?.client) filters.push(eq(projects.clientId, filter.client));
		if (filter?.from) filters.push(gte(projects.createdAt, filter.from));
		if (filter?.to) filters.push(lte(projects.createdAt, filter.to));

		const query = db
			.select({ count: count() })
			.from(projects)
			.$dynamic()
			.where(and(eq(projects.ownerId, userId), ...filters));

		const result = await query;
		return result[0]?.count ?? 0;
	},
};
