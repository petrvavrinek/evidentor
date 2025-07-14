import { client, invoice, invoiceItem, project } from "@/db/schema";
import { createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";

const InvoiceSelectSchema = createSelectSchema(invoice);
const InvoiceItemSelectSchema = createSelectSchema(invoiceItem);

export const CreateInvoiceSchema = t.Object({
	...t.Pick(InvoiceSelectSchema, [
		"clientId",
		"projectId",
		"status",
		"dueDate",
		"currency",
	]).properties,
	items: t.Array(
		t.Object({
			name: t.String(),
			qty: t.Integer(),
			unitPrice: t.Integer(),
		}),
	),
});

export type CreateInvoiceType = Static<typeof CreateInvoiceSchema>;

export const InvoiceIdParam = t.Object({
	id: t.Number(),
});

const InvoiceProjectSelectSchema = createSelectSchema(project);
const InvoiceClientSelectSchema = createSelectSchema(client);

export const SelectInvoice = t.Object({
	...createSelectSchema(invoice).properties,
	project: t.Nullable(InvoiceProjectSelectSchema),
	client: t.Nullable(InvoiceClientSelectSchema),
	items: t.Array(InvoiceItemSelectSchema),
});

export const InvoiceResponse = t.Omit(SelectInvoice, []);
export const InvoicesResponse = t.Array(SelectInvoice);
