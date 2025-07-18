import { randomUUID } from "node:crypto";
import path from "node:path";
import {
	createWorker,
	InvoiceQueue,
	type InvoiceQueueDataType,
	type InvoiceQueueResultType,
} from "@evidentor/queues";
import { storage } from "@evidentor/storage";
import { renderToStream } from "@react-pdf/renderer";

import { InvoiceDocument } from "./renderer/Invoice";

export const InvoiceWorker = createWorker<
	InvoiceQueueDataType,
	InvoiceQueueResultType
>(InvoiceQueue.name, async (job) => {
	if (job.data.type !== "generate-invoice") return { ok: false };

	const { data: invoiceData } = job.data;
	const doc = InvoiceDocument(invoiceData);
	console.log("Generating invoice", invoiceData.id);

	const filePath = path.join("invoices", `${randomUUID()}.pdf`);
	const stream = await renderToStream(doc);
	await storage.write(filePath, stream, { mimeType: "application/pdf" });
	console.log("saved to", filePath);

	return { ok: true, filePath: filePath };
});
