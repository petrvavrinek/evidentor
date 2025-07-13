import { and, eq, type SQL } from "drizzle-orm";
import { db } from "../../database";
import { invoice } from "../../db/schema";

interface CreateInvoiceQueryOptions {
	filters?: SQL[];
}

export const InvoicesService = {
	/**
	 * Create find query that automatically include relations
	 * @param options Options to find
	 * @returns
	 */
	async createFindQuery(options?: CreateInvoiceQueryOptions) {
		const query = db.select().from(invoice).$dynamic();

		if (options?.filters) query.where(and(...options.filters));

		return query;
	},

	/**
	 * Find multiple invoices by user
	 * @param userId User ID
	 * @returns Array of invoices
	 */
	findManyByUserId(userId: string) {
		return this.createFindQuery({ filters: [eq(invoice.ownerId, userId)] });
	},

	/**
	 * Find invoice by ID
	 * @param userId User ID
	 * @param id Invoice ID
	 * @returns Invoice or null
	 */
	async findById(userId: string, id: number) {
		const results = await this.createFindQuery({
			filters: [eq(invoice.id, id), eq(invoice.ownerId, userId)],
		});

		return results[0] ?? null;
	},

	async create(
		userId: string,
		data: Partial<
			Omit<typeof invoice.$inferInsert, "id" | "ownerId" | "createdAt">
		>,
	) {
		const [created] = await db
			.insert(invoice)
			.values({ ...data, ownerId: userId })
			.returning();
		return created;
	},

	async updateById(
		userId: string,
		id: number,
		data: Partial<
			Omit<typeof invoice.$inferInsert, "id" | "ownerId" | "createdAt">
		>,
	) {
		const [updated] = await db
			.update(invoice)
			.set(data)
			.where(and(eq(invoice.ownerId, userId), eq(invoice.id, id)))
			.returning();
		return updated;
	},

	/**
	 * Delete invoice by ID
	 * @param userId User ID
	 * @param id Invoice ID
	 */
	async deleteById(userId: string, id: number) {
		await db
			.delete(invoice)
			.where(and(eq(invoice.ownerId, userId), eq(invoice.id, id)));
	},
};
