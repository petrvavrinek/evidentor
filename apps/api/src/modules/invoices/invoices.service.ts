import { and, eq, type SQL } from "drizzle-orm";
import { db } from "../../database";
import { invoice, invoiceItem } from "../../db/schema";
import type { CreateInvoiceType } from "./invoice.schemas";

interface CreateInvoiceQueryOptions {
	filters?: SQL[];
}

export const InvoicesService = {
	findByOptions(options?: CreateInvoiceQueryOptions) {
		return db.query.invoice.findMany({
			with: {
				client: true,
				items: true,
				project: true,
			},
			where: options?.filters ? and(...options.filters) : undefined,
		});
	},

	/**
	 * Find multiple invoices by user
	 * @param userId User ID
	 * @returns Array of invoices
	 */
	findManyByUserId(userId: string) {
		return this.findByOptions({ filters: [eq(invoice.ownerId, userId)] });
	},

	/**
	 * Find invoice by ID
	 * @param userId User ID
	 * @param id Invoice ID
	 * @returns Invoice or null
	 */
	async findById(userId: string, id: number) {
		const results = await this.findByOptions({
			filters: [eq(invoice.id, id), eq(invoice.ownerId, userId)],
		});

		return results?.[0] ?? null;
	},

	async create(userId: string, data: CreateInvoiceType) {
		return db.transaction(async (tx) => {
			const [created] = await tx
				.insert(invoice)
				.values({ ...data, ownerId: userId, amount: 0 })
				.returning();

			await tx.insert(invoiceItem).values(
				data.items.map((e) => ({
					name: e.name,
					qty: e.qty,
					unitPrice: e.unitPrice,
					invoiceId: created.id,
				})),
			);

			return created;
		});
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
