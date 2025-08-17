import { InvoiceQueue } from "@evidentor/queues";
import Elysia, { status, t } from "elysia";

import { BetterAuthMacro } from "../auth";
import {
	InvoiceCreateSchema,
	InvoiceIdParamSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema,
} from "./invoice.schemas";

// TODO: REWORK IMPORTS THIS!
import { ProjectsService } from "../projects/projects.service";
import { InvoicesService } from "./invoices.service";
import { convertInvoiceToQueueType } from "./utils/convert-queue";
import { ClientsService } from "../clients/clients.service";

const router = new Elysia({
	prefix: "/invoices",
	detail: { tags: ["Invoice"] },
})
	.use(BetterAuthMacro)
	.model("Invoice", InvoiceResponseSchema)
	.model("Invoice[]", InvoicesResponseSchema)
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
			const project = await ProjectsService.findById(user.id, body.projectId);
			if (!project) throw status(400, "Project not found");

			if (!project.client) throw status(400, "Project does not have client assigned");

			const invoice = await InvoicesService.create(user.id, { ...body, clientId: project.client.id });
			const newInvoice = (await InvoicesService.findById(
				user.id,
				invoice!.id,
			))!;

			// Generate invoice in the background
			const invoiceQueueData = convertInvoiceToQueueType(newInvoice);
			await InvoiceQueue.add("", {
				type: "generate-invoice",
				data: invoiceQueueData,
			});

			return newInvoice;
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

export default router;
