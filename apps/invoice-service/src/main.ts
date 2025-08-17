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
import { renderToBuffer } from "@react-pdf/renderer";

import { InvoiceDocument } from "./renderer/Invoice";

const logger = new LoggerService("InvoiceWorker");

if (!await storage.directoryExists("invoices")) {
	storage.createDirectory("invoices");
	logger.info("Created invoices storage directory")
}

export const InvoiceWorker = createWorker<
	InvoiceQueueDataType,
	InvoiceQueueResultType
>(InvoiceQueue.name, async (job) => {
	if (job.data.type !== "generate-invoice") return { ok: false };

	const { data: invoiceData } = job.data;
	logger.info(`Received invoice generate job for invoice ${invoiceData.id}`);

	const fileId = randomUUID();
	const doc = InvoiceDocument(invoiceData);
	const filePath = path.join("invoices", `${fileId}.pdf`);
	const buffer = await renderToBuffer(doc);

	await storage.write(filePath, buffer, { mimeType: "application/pdf" });

	logger.info(`Invoice ${invoiceData.id} generated to "${filePath}"`);
	return { ok: true, filePath: filePath, id: invoiceData.id, fileId };
});

InvoiceWorker.on("error", e => {
	logger.error(e.name, e.message);
});

const server = Bun.serve({
	routes: {
		"/status": new Response("OK"),
	},
	port: process.env.PORT ?? 3000,
	hostname: "0.0.0.0",
});

logger.info(`Listening for healthchecks on ${server.hostname}:${server.port}`);
logger.info(`Connected and waiting for jobs...`);
