import { createSelectSchema } from "drizzle-typebox";
import { type Static, t } from "elysia";
import {
	client,
	invoice,
	invoiceItem,
	project,
	projectTask,
} from "@/db/schema";

const InvoiceSchema = createSelectSchema(invoice);
const InvoiceItemSchema = createSelectSchema(invoiceItem);
const ProjectTaskSchema = createSelectSchema(projectTask);

export const InvoiceCreateSchema = t.Object({
	...t.Pick(InvoiceSchema, ["clientId", "projectId", "dueDate", "currency"])
		.properties,
	items: t.Array(
		t.Object({
			name: t.String(),
			qty: t.Integer(),
			unitPrice: t.Integer(),
			projectTaskId: t.Optional(t.Integer()),
			projectTask: t.Optional(ProjectTaskSchema),
		}),
	),
});

export type InvoiceCreateType = Static<typeof InvoiceCreateSchema>;

export const InvoiceIdParamSchema = t.Object({
	id: t.Number(),
});

const ProjectSelectSchema = createSelectSchema(project);
const ClientSelectSchema = createSelectSchema(client);

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
