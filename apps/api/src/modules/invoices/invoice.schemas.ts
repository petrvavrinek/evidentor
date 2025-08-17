import { createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";
import {
	clients,
	invoices,
	invoiceItems,
	timeEntries,
} from "@/db/schema";

const InvoiceSchema = createSelectSchema(invoices);
const InvoiceItemSchema = createSelectSchema(invoiceItems);
const TimeEntrySchema = createSelectSchema(timeEntries);

export const InvoiceCreateSchema = t.Object({
	...t.Pick(InvoiceSchema, ["dueDate", "currency", "clientId"])
		.properties,
	items: t.Array(
		t.Object({
			name: t.String(),
			qty: t.Number(),
			unitPrice: t.Number(),
			timeEntryId: t.Optional(t.Nullable(t.Number())),
		}),
	),
	dueDate: t.Date()
});

export type InvoiceCreateType = Static<typeof InvoiceCreateSchema>;

export const InvoiceIdParamSchema = t.Object({
	id: t.Number(),
});

const ClientSelectSchema = createSelectSchema(clients);

export const InvoiceSelectSchema = t.Object({
	...InvoiceSchema.properties,
	client: t.Nullable(ClientSelectSchema),
	items: t.Array(
		t.Object({
			...InvoiceItemSchema.properties,
			timeEntry: t.Nullable(TimeEntrySchema),
		}),
	),
});

export const InvoiceResponseSchema = t.Omit(InvoiceSelectSchema, []);
export const InvoicesResponseSchema = t.Array(InvoiceSelectSchema);

export type InvoiceSelectSchemaType = Static<typeof InvoiceSelectSchema>;
