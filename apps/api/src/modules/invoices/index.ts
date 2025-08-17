import { InvoiceQueue, InvoiceQueueEvents, Job, type InvoiceQueueDataType, type InvoiceQueueResultType } from "@evidentor/queues";
import Elysia, { status, t } from "elysia";
import path from "node:path";


import { BetterAuthMacro } from "../auth";
import {
	InvoiceCreateSchema,
	InvoiceIdParamSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema,
} from "./invoice.schemas";

// TODO: REWORK IMPORTS THIS!
import { storage } from "@evidentor/storage";
import { ProjectsService } from "../projects/projects.service";
import { InvoicesService } from "./invoices.service";
import { convertInvoiceToQueueType } from "./utils/convert-queue";
import { LoggerService } from "@evidentor/logging";


const logger = new LoggerService("invoices");

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
			const job = await InvoiceQueue.add("", {
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
		const id = Number.parseInt(result.id);
		await InvoicesService.updateInvoiceGeneratedFilePath(id, result.fileId);
		logger.info(`Invoice ${id} generated to file ${result.fileId}`);
	});

	const invoices = await InvoicesService.findInvoicesWithoutGeneratedFile();
	logger.info(`Found ${invoices.length} invoices without generated file`);
	const convertedInvoices = invoices.map(e => convertInvoiceToQueueType(e));

	for (const convertedInvoice of convertedInvoices) {
		InvoiceQueue.add("", {
			type: "generate-invoice",
			data: convertedInvoice,
		});
	}
});


export default router;
