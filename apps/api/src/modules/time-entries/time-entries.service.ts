import { and, eq, gte, lte, sql } from "drizzle-orm";

import { timeEntries } from "@/db/schema";

import { db } from "../../database";
import { ProjectsService } from "../projects/projects.service";
import type { TimeEntryFilterType } from "./time-entries.dto";

type TimeEntry = typeof timeEntries.$inferSelect;

export const TimeEntriesService = {
	/**
	 * Return active time entry for user
	 * @param userId User ID
	 * @returns Entry or null
	 */
	getActiveByUserId(userId: string) {
		return db.query.timeEntry.findFirst({
			where: (entry, { and, eq, isNull }) =>
				and(eq(entry.userId, userId), isNull(entry.endAt)),
			with: {
				project: {
					with: {
						client: true,
					},
				},
				projectTask: true,
			},
		});
	},

	/**
	 * Return user time entries
	 * @param userId User ID
	 * @returns Array of entries
	 */
	findByUserId(userId: string) {
		return db.query.timeEntry.findMany({
			where: (entry, { eq }) => eq(entry.userId, userId),
			with: {
				project: {
					with: {
						client: true,
					},
				},
				projectTask: true,
			},
		});
	},
	/**
	 * Find time entry by ID and user ID
	 * @param userId User ID
	 * @param id Entry ID
	 * @returns
	 */
	findById(userId: string, id: number) {
		return db.query.timeEntry.findFirst({
			where: (entry, { and, eq }) =>
				and(eq(entry.userId, userId), eq(entry.id, id)),
			with: {
				project: {
					with: {
						client: true,
					},
				},
				projectTask: true,
			},
		});
	},

	/**
	 * Update time entry by ID
	 * @param userId User ID
	 * @param id Entry ID
	 * @param data Data to update
	 * @returns New time entry
	 */
	async updateById(
		userId: string,
		id: number,
		data: Partial<Omit<TimeEntry, "userId" | "id" | "createdAt">>,
	) {
		const entry = await db
			.update(timeEntries)
			.set(data)
			.where(and(eq(timeEntries.userId, userId), eq(timeEntries.id, id)))
			.returning();

		return entry[0] ?? null;
	},

	/**
	 * Delete time entry by ID
	 * @param userId User ID
	 * @param id Entry ID
	 * @returns TimeEntry if removed, otherwise null
	 */
	deleteById(userId: string, id: number) {
		return db
			.delete(timeEntries)
			.where(and(eq(timeEntries.userId, userId), eq(timeEntries.id, id)))
			.returning();
	},

	/**
	 * Create new time entry
	 * @param userId User ID
	 * @param data Time entry data
	 * @returns New time entry
	 * @throws User already has active time entry
	 */
	async create(userId: string, data: Partial<TimeEntry>) {
		if (data.projectId) {
			const project = await ProjectsService.findById(userId, data.projectId);
			if (!project)
				throw new Error("Project is not found or not accessible to user");
		}

		if (!data.endAt) {
			const active = await this.getActiveByUserId(userId);
			if (active) throw new Error("User already has active time entry");
		}

		const entry = await db
			.insert(timeEntries)
			.values({
				...data,
				userId,
			})
			.returning();

		return entry[0] ?? null;
	},

	/**
	 * Outputs dates and ms to each da
	 * @param userId User ID
	 * @param filter Filter
	 */
	async getDurationEachDate(userId: string, filter?: TimeEntryFilterType) {
		const filters = [];

		if (filter?.projectId)
			filters.push(eq(timeEntries.projectId, filter.projectId));

		if (filter?.from) {
			filters.push(
				and(
					gte(timeEntries.startAt, filter.from),
					gte(timeEntries.endAt, filter.from),
				),
			);
		}

		if (filter?.to) {
			filters.push(
				and(lte(timeEntries.startAt, filter.to), lte(timeEntries.endAt, filter.to)),
			);
		}

		const query = db
			.select({
				date: sql<Date>`DATE(${timeEntries.startAt})`,
				duration: sql<number>`ROUND(SUM(EXTRACT(EPOCH FROM (${timeEntries.endAt} - ${timeEntries.startAt}))))`,
			})
			.from(timeEntries)
			.where(and(eq(timeEntries.userId, userId), ...filters));

		const result = await query.groupBy(sql`DATE(${timeEntries.startAt})`);
		return result.map((e) => ({ date: e.date, duration: Number(e.duration) }));
	},
};
