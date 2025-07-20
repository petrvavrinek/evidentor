import { randomUUID } from "node:crypto";
import path from "node:path";
import { LoggerService } from "@evidentor/logging";
import {
	createWorker,
	InvoiceQueue,
	type InvoiceQueueDataType,
	type InvoiceQueueResultType,
} from "@evidentor/queues";
import { storage } from "@evidentor/storage";
import { renderToStream } from "@react-pdf/renderer";

import { InvoiceDocument } from "./renderer/Invoice";

const logger = new LoggerService("InvoiceWorker");

export const InvoiceWorker = createWorker<
	InvoiceQueueDataType,
	InvoiceQueueResultType
>(InvoiceQueue.name, async (job) => {
	if (job.data.type !== "generate-invoice") return { ok: false };

	const { data: invoiceData } = job.data;
	logger.info(`Received invoice generate job for invoice ${invoiceData.id}`);

	const doc = InvoiceDocument(invoiceData);
	const filePath = path.join("invoices", `${randomUUID()}.pdf`);
	const stream = await renderToStream(doc);
	await storage.write(filePath, stream, { mimeType: "application/pdf" });

	logger.info(`Invoice ${invoiceData.id} generated to "${filePath}"`);
	return { ok: true, filePath: filePath };
});
