import Elysia, { status, t } from "elysia";
import { betterAuth } from "../../auth";
import {
	InvoiceCreateSchema,
	InvoiceIdParamSchema,
	InvoiceResponseSchema,
} from "./invoice.schemas";

import { ClientsService } from "../clients/clients.service";
import { ProjectsService } from "../projects/projects.service";
import { InvoicesService } from "./invoices.service";

export const invoicesRouter = new Elysia({
	prefix: "/invoice",
	detail: { tags: ["Invoice"] },
})
	.use(betterAuth)
	.model("Invoice", InvoiceResponseSchema)
	.model("Invoice[]", InvoiceResponseSchema)
	.get("", async ({ user }) => InvoicesService.findManyByUserId(user.id), {
		auth: true,
		detail: { description: "Get all user invoices" },
		response: "Invoice[]",
	})
	.get(
		":id",
		async ({ user, params }) => {
			const invoice = await InvoicesService.findById(user.id, params.id);
			if (!invoice) throw status(404, "Invoice not found");
			return invoice;
		},
		{
			auth: true,
			params: InvoiceIdParamSchema,
			response: "Invoice",
			detail: { description: "Get invoice by id" },
		},
	)
	.post(
		"",
		async ({ user, body }) => {
			if (body.clientId) {
				const client = await ClientsService.findById(user.id, body.clientId);
				if (!client) throw status(404, "Client not found");
			}
			if (body.projectId) {
				const project = await ProjectsService.findById(user.id, body.projectId);
				if (!project) throw status(404, "Project not found");
			}

			const invoice = await InvoicesService.create(user.id, body);
			return (await InvoicesService.findById(user.id, invoice.id))!;
		},
		{
			auth: true,
			body: InvoiceCreateSchema,
			response: "Invoice",
			detail: { description: "Create invoice" },
		},
	)
	// .patch(
	// 	"/:id",
	// 	async ({ user, params, body }) =>
	// 		InvoicesService.updateById(user.id, params.id, body),
	// 	{
	// 		auth: true,
	// 		params: InvoiceIdParam,
	// 		body: UpdateInvoice,
	// 		response: "Invoice",
	// 		detail: { description: "Update invoice" },
	// 	},
	// )
	.delete(
		":id",
		async ({ user, params }) => {
			await InvoicesService.deleteById(user.id, params.id);
			return { success: true };
		},
		{
			auth: true,
			params: InvoiceIdParamSchema,
			response: t.Object({ success: t.Boolean() }),
			detail: { description: "Delete invoice" },
		},
	);
