import { and, eq, type SQL, inArray, isNull, count, sql } from "drizzle-orm";

import { db } from "../../database";
import { invoices, invoiceItems, timeEntries, projects } from "@/db/schema";

import type { InvoiceCreateType, InvoiceFilter } from "./invoice.schemas";

interface CreateInvoiceQueryOptions {
	where?: SQL[];
}

export const InvoicesService = {
	/**
	 * Find many invoice with options
	 */
	findByOptions(options?: CreateInvoiceQueryOptions, filter?: InvoiceFilter) {
		const filters: SQL[] = [];
		if (filter) {
			if (filter.automationRuleId) {
				filters.push(eq(invoices.automationRuleId, filter.automationRuleId));
			}
		}

		return db.query.invoices.findMany({
			with: {
				items: {
					with: {
						timeEntry: true
					},
				},
				client: true,
				project: true
			},
			where: options?.where ? and(...options.where, ...filters) : undefined,
		});
	},

	/**
	 * Find one invoice with options
	 * @param id Invoice ID
	 * @param options Options
	 * @returns
	 */
	async findOneByOptions(id: number, options?: CreateInvoiceQueryOptions, filter?: InvoiceFilter) {
		const result = await this.findByOptions({
			where: [eq(invoices.id, id), ...(options?.where ?? [])],
		}, filter);
		return result?.[0] ?? null;
	},

	/**
	 * Find multiple invoices by user
	 * @param userId User ID
	 * @returns Array of invoices
	 */
	findManyByUserId(userId: string, filter?: InvoiceFilter) {
		return this.findByOptions({ where: [eq(invoices.userId, userId)] }, filter);
	},

	/**
	 * Find invoice by ID
	 * @param userId User ID
	 * @param id Invoice ID
	 * @returns Invoice or null
	 */
	async findById(userId: string, id: number) {
		const results = await this.findByOptions({
			where: [eq(invoices.id, id), eq(invoices.userId, userId)],
		});

		return results?.[0] ?? null;
	},

	async create(userId: string, data: InvoiceCreateType & { clientId: number }) {
		return db.transaction(async (tx) => {
			const now = new Date();
			const invoicesToday = await tx
				.select({ count: count() })
				.from(invoices)
				.where(
					and(
						eq(invoices.userId, userId),
						sql`DATE(${invoices.issuedAt}) = CURRENT_DATE`
					)
				);
			const invoicesCount = invoicesToday[0]?.count ?? 0;
			const invoiceTextId = this.getInvoiceTextId(now, invoicesCount + 1);

			const timeEntryIds = data.items.filter(e => !!e.timeEntryId).map(e => e.timeEntryId as number);

			const timeEntryItems = await tx
				.select({ id: timeEntries.id })
				.from(timeEntries)
				.leftJoin(projects, eq(projects.id, data.projectId))
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
				.values({
					...data,
					userId,
					amount,
					textId: invoiceTextId
				})
				.returning();

			// Set invoice into time entries
			await tx.update(timeEntries).set({
				invoiceId: createdInvoice?.id,
			})
				.where(inArray(timeEntries.id, timeEntryItems.map(e => e.id)))

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
			.where(and(eq(invoices.userId, userId), eq(invoices.id, id)))
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
			.where(and(eq(invoices.userId, userId), eq(invoices.id, id)));
	},

	async updateInvoiceGeneratedFilePath(id: number, fileId: string) {
		await db.update(invoices).set({ generatedFileId: fileId }).where(eq(invoices.id, id));
	},

	findInvoicesWithoutGeneratedFile() {
		return this.findByOptions({ where: [isNull(invoices.generatedFileId)] })
	},
	getInvoiceTextId(date: Date, idx: number) {
		const y = date.getFullYear().toString();
		const m = date.getMonth().toString().padStart(2, "0");
		const d = date.getDate().toString().padStart(2, "0");
		const i = idx.toString().padStart(3, "0");
		return `${y}${m}${d}${i}`;
	}
};
