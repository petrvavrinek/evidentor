import { and, count, eq, gte, lte } from "drizzle-orm";
import { db } from "../../database";
import { project } from "../../db/schema";
import type { ProjectQueryFilterType } from "./projects.dto";

type Project = typeof project.$inferInsert;

export const ProjectsService = {
	findManyByUserId(userId: string) {
		return db.query.project.findMany({
			where: eq(project.ownerId, userId),
			with: {
				client: true,
			},
		});
	},

	findById(userId: string, id: number) {
		return db.query.project.findFirst({
			where: and(eq(project.ownerId, userId), eq(project.id, id)),
			with: {
				client: true,
			},
		});
	},

	async create(userId: string, data: Project) {
		const [createdProject] = await db
			.insert(project)
			.values({
				...data,
				ownerId: userId,
			})
			.returning();
		return createdProject;
	},

	async updateById(userId: string, id: number, data: Partial<Project>) {
		const updatedProject = await db
			.update(project)
			.set(data)
			.where(and(eq(project.id, id), eq(project.ownerId, userId)))
			.returning();

		return updatedProject[0] ?? null;
	},

	deleteById(userId: string, id: number) {
		return db
			.delete(project)
			.where(and(eq(project.id, id), eq(project.ownerId, userId)))
			.returning();
	},

	async getCount(
		userId: string,
		filter?: ProjectQueryFilterType,
	): Promise<number> {
		const filters = [];

		if (filter?.client) filters.push(eq(project.clientId, filter.client));
		if (filter?.from) filters.push(gte(project.createdAt, filter.from));
		if (filter?.to) filters.push(lte(project.createdAt, filter.to));

		const query = db
			.select({ count: count() })
			.from(project)
			.$dynamic()
			.where(and(eq(project.ownerId, userId), ...filters));

		const result = await query;
		return result[0]?.count ?? 0;
	},
};
