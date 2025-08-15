import { createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";
import {
	clients,
	invoices,
	invoiceItems,
	projects,
	projectTasks,
} from "@/db/schema";

const InvoiceSchema = createSelectSchema(invoices);
const InvoiceItemSchema = createSelectSchema(invoiceItems);
const ProjectTaskSchema = createSelectSchema(projectTasks);

export const InvoiceCreateSchema = t.Object({
	...t.Pick(InvoiceSchema, ["projectId", "dueDate", "currency"])
		.properties,
	items: t.Array(
		t.Object({
			name: t.String(),
			qty: t.Number(),
			unitPrice: t.Number(),
			projectTaskId: t.Optional(t.Number()),
		}),
	),
	projectId: t.Number(),
	dueDate: t.Date()
});

export type InvoiceCreateType = Static<typeof InvoiceCreateSchema>;

export const InvoiceIdParamSchema = t.Object({
	id: t.Number(),
});

const ProjectSelectSchema = createSelectSchema(projects);
const ClientSelectSchema = createSelectSchema(clients);

export const InvoiceSelectSchema = t.Object({
	...InvoiceSchema.properties,
	project: t.Nullable(ProjectSelectSchema),
	client: t.Nullable(ClientSelectSchema),
	items: t.Array(
		t.Object({
			...InvoiceItemSchema.properties,
			projectTask: t.Nullable(ProjectTaskSchema),
		}),
	),
});

export const InvoiceResponseSchema = t.Omit(InvoiceSelectSchema, []);
export const InvoicesResponseSchema = t.Array(InvoiceSelectSchema);

export type InvoiceSelectSchemaType = Static<typeof InvoiceSelectSchema>;
