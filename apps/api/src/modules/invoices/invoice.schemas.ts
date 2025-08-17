import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";
import {
	clients,
	invoices,
	invoiceItems,
	timeEntries,
	projects,
} from "@/db/schema";

const CreateInvoiceSchema = createInsertSchema(invoices, {
	projectId: t.Number(),
	dueDate: t.Transform(t.Date())
		.Decode(e => new Date(e))
		.Encode(e => e)
});

export const InvoiceCreateSchema = t.Intersect([
	t.Pick(CreateInvoiceSchema, ["dueDate", "currency", "projectId"]),
	t.Object({
		items: t.Array(
			t.Object({
				name: t.String(),
				qty: t.Number(),
				unitPrice: t.Number(),
				timeEntryId: t.Optional(t.Nullable(t.Number())),
			}),
		),
	})
]);

export type InvoiceCreateType = Static<typeof InvoiceCreateSchema>;

export const InvoiceIdParamSchema = t.Object({
	id: t.Number(),
});

const ClientSelectSchema = createSelectSchema(clients);
const InvoiceSchema = createSelectSchema(invoices);
const InvoiceItemSchema = createSelectSchema(invoiceItems);
const TimeEntrySchema = createSelectSchema(timeEntries);
const ProjectSelectSchema = createSelectSchema(projects);

export const InvoiceSelectSchema = t.Object({
	...InvoiceSchema.properties,
	client: t.Nullable(ClientSelectSchema),
	project: t.Nullable(ProjectSelectSchema),
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
