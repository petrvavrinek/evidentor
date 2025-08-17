import { and, eq, type SQL, inArray, isNull } from "drizzle-orm";

import { db } from "../../database";
import { invoices, invoiceItems, timeEntries } from "@/db/schema";

import type { InvoiceCreateType } from "./invoice.schemas";

interface CreateInvoiceQueryOptions {
	filters?: SQL[];
}

export const InvoicesService = {
	/**
	 * Find many invoice with options
	 */
	findByOptions(options?: CreateInvoiceQueryOptions) {
		return db.query.invoices.findMany({
			with: {
				items: {
					with: {
						timeEntry: true
					},
				},
				client: true
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
			filters: [eq(invoices.id, id), ...(options?.filters ?? [])],
		});
		return result?.[0] ?? null;
	},

	/**
	 * Find multiple invoices by user
	 * @param userId User ID
	 * @returns Array of invoices
	 */
	findManyByUserId(userId: string) {
		return this.findByOptions({ filters: [eq(invoices.ownerId, userId)] });
	},

	/**
	 * Find invoice by ID
	 * @param userId User ID
	 * @param id Invoice ID
	 * @returns Invoice or null
	 */
	async findById(userId: string, id: number) {
		const results = await this.findByOptions({
			filters: [eq(invoices.id, id), eq(invoices.ownerId, userId)],
		});

		return results?.[0] ?? null;
	},

	async create(userId: string, data: InvoiceCreateType) {
		return db.transaction(async (tx) => {
			const timeEntryIds = data.items.filter(e => !!e.timeEntryId).map(e => e.timeEntryId as number);

			const timeEntryItems = await tx
				.select({ id: timeEntries.id, invoiceId: timeEntries.invoiceId })
				.from(timeEntries)
				.where(
					and(
						eq(timeEntries.userId, userId),
						inArray(timeEntries.id, timeEntryIds),
						isNull(timeEntries.invoiceId)
					)
				);

			const invoiceTimeEntryIds = timeEntryItems.map(e => e.id);

			// Calculate total amount
			const amount = data.items.reduce(
				(prev, current) => prev + current.unitPrice * current.qty,
				0,
			);

			// Create invoice
			const [createdInvoice] = await tx
				.insert(invoices)
				.values({ ...data, ownerId: userId, amount })
				.returning();

			// Create invoice items
			await tx.insert(invoiceItems).values(
				data.items.map((e) => ({
					name: e.name,
					qty: e.qty,
					unitPrice: e.unitPrice,
					invoiceId: createdInvoice?.id,
					timeEntryId: e.timeEntryId && invoiceTimeEntryIds.includes(e.timeEntryId) ? e.timeEntryId : null
				}))
			);

			return createdInvoice;
		});
	},

	async updateById(
		userId: string,
		id: number,
		data: Partial<
			Omit<typeof invoices.$inferInsert, "id" | "ownerId" | "createdAt">
		>,
	) {
		const [updated] = await db
			.update(invoices)
			.set(data)
			.where(and(eq(invoices.ownerId, userId), eq(invoices.id, id)))
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
			.delete(invoices)
			.where(and(eq(invoices.ownerId, userId), eq(invoices.id, id)));
	},
};
