import Elysia, { t } from "elysia";
import { betterAuth } from "../../auth";
import {
	CreateInvoice,
	UpdateInvoice,
	InvoiceIdParam,
	InvoiceResponse,
	InvoicesResponse,
} from "./invoice.schemas";
import { InvoicesService } from "./invoices.service";

export const invoicesRouter = new Elysia({
	prefix: "/invoices",
	detail: { tags: ["Invoice"] },
})
	.use(betterAuth)
	.model("Invoice", InvoiceResponse)
	.model("Invoice[]", InvoicesResponse)
	.get("/", async ({ user }) => InvoicesService.findManyByUserId(user.id), {
		auth: true,
		detail: { description: "Get all user invoices" },
		response: "Invoice[]",
	})
	.get(
		"/:id",
		async ({ user, params }) => InvoicesService.findById(user.id, params.id),
		{
			auth: true,
			params: InvoiceIdParam,
			response: "Invoice",
			detail: { description: "Get invoice by id" },
		},
	)
	.post("/", async ({ user, body }) => InvoicesService.create(user.id, body), {
		auth: true,
		body: CreateInvoice,
		response: "Invoice",
		detail: { description: "Create invoice" },
	})
	.patch(
		"/:id",
		async ({ user, params, body }) =>
			InvoicesService.updateById(user.id, params.id, body),
		{
			auth: true,
			params: InvoiceIdParam,
			body: UpdateInvoice,
			response: "Invoice",
			detail: { description: "Update invoice" },
		},
	)
	.delete(
		"/:id",
		async ({ user, params }) => {
			await InvoicesService.deleteById(user.id, params.id);
			return { success: true };
		},
		{
			auth: true,
			params: InvoiceIdParam,
			response: t.Object({ success: t.Boolean() }),
			detail: { description: "Delete invoice" },
		},
	);
