import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { invoice } from "@/db/schema";

const InvoiceSelectSchema = createInsertSchema(invoice);

export const CreateInvoice = t.Pick(InvoiceSelectSchema, [
	"clientId",
	"projectId",
	"status",
	"dueDate",
]);

export const UpdateInvoice = t.Partial(CreateInvoice);

export const InvoiceIdParam = t.Object({
	id: t.Number(),
});

export const InvoiceResponse = t.Omit(InvoiceSelectSchema, []);
export const InvoicesResponse = t.Array(InvoiceResponse);
