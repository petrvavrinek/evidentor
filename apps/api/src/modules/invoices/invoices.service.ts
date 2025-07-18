import { and, eq, type SQL } from "drizzle-orm";
import { db } from "../../database";
import { invoice, invoiceItem } from "../../db/schema";
import type { InvoiceCreateType } from "./invoice.schemas";

interface CreateInvoiceQueryOptions {
	filters?: SQL[];
}

export const InvoicesService = {
	/**
	 * Find many invoice with options
	 */
	findByOptions(options?: CreateInvoiceQueryOptions) {
		return db.query.invoice.findMany({
			with: {
				client: true,
				items: {
					with: {
						projectTask: true,
					},
				},
				project: true,
			},
			where: options?.filters ? and(...options.filters) : undefined,
		});
	},

	/**
	 * Find one invoice with options
	 * @param id Invoice ID
	 * @param options Options
	 * @returns
	 */
	async findOneByOptions(id: number, options?: CreateInvoiceQueryOptions) {
		const result = await this.findByOptions({
			filters: [eq(invoice.id, id), ...(options?.filters ?? [])],
		});
		return result?.[0] ?? null;
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

	async create(userId: string, data: InvoiceCreateType) {
		return db.transaction(async (tx) => {
			const amount = data.items.reduce(
				(prev, current) => prev + current.unitPrice * current.qty,
				0,
			);

			const [created] = await tx
				.insert(invoice)
				.values({ ...data, ownerId: userId, amount })
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
