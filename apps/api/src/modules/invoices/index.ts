import { InvoiceQueue, InvoiceQueueEvents, Job, type InvoiceQueueDataType, type InvoiceQueueResultType } from "@evidentor/queues";
import Elysia, { status, t } from "elysia";
import path from "node:path";

import { LoggerService } from "@evidentor/logging";
import { storage } from "@evidentor/storage";

import { BetterAuthMacro } from "../auth";
import { ProjectsService } from "../projects/projects.service";
import {
	InvoiceCreateSchema,
	InvoiceFilterSchema,
	InvoiceIdParamSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema,
} from "./invoice.schemas";
import { InvoicesService } from "./invoices.service";

const logger = new LoggerService("invoices");

const router = new Elysia({
	prefix: "/invoices",
	detail: { tags: ["Invoice"] },
})
	.use(BetterAuthMacro)
	.model("Invoice", InvoiceResponseSchema)
	.model("Invoice[]", InvoicesResponseSchema)
	.get("", async ({ user, query }) => InvoicesService.findManyByUserId(user.id, query), {
		auth: true,
		detail: { description: "Get all user invoices" },
		response: "Invoice[]",
		query: InvoiceFilterSchema
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
			if (!invoice) throw status(500, "Could not create invoice");
			await InvoicesService.requestGenerate(invoice);
			return invoice;
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
			const invoice = await InvoicesService.findById(user.id, params.id);
			if (!invoice) throw status(404, "Invoice not found");

			const filePath = path.join("invoices", `${invoice.generatedFileId}.pdf`);
			if (await storage.fileExists(filePath))
				await storage.deleteFile(filePath);

			await InvoicesService.deleteById(user.id, params.id);
			return { success: true };
		},
		{
			auth: true,
			params: InvoiceIdParamSchema,
			response: t.Object({ success: t.Boolean() }),
			detail: { description: "Delete invoice" },
		},
	)
	.get(":id/generated", async ({ user, params }) => {
		const invoice = await InvoicesService.findById(user.id, params.id);
		if (!invoice) throw status(404, "Invoice not found");

		const filePath = path.join("invoices", `${invoice.generatedFileId}.pdf`);
		const exist = await storage.fileExists(filePath);
		if (!exist) throw status(404, "File not found");
		return storage.read(filePath);
	}, {
		auth: true,
		params: InvoiceIdParamSchema
	});


router.on("start", async () => {
	logger.info("Listening for invoice file generation");
	InvoiceQueueEvents.on("completed", async ({ jobId }) => {
		const job = await Job.fromId<InvoiceQueueDataType, InvoiceQueueResultType>(InvoiceQueue, jobId);
		if (!job?.returnvalue) {
			logger.warn(`Could not get return returnvalue from job: ${jobId}`)
			return;
		}
		const { returnvalue: result } = job;
		if (!result.ok) {
			logger.warn(`Could not generate invoice for job: ${jobId}`)
			return;
		}
		
		const id = result.id;
		await InvoicesService.updateInvoiceGeneratedFilePath(id, result.fileId);
		logger.info(`Invoice ${id} generated to file ${result.fileId}`);
	});

	const invoices = await InvoicesService.findInvoicesWithoutGeneratedFile();
	logger.info(`Found ${invoices.length} invoices without generated file`);

	for (const invoice of invoices)
		InvoicesService.requestGenerate(invoice);

});


export default router;
