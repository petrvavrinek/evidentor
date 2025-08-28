import { QueueEvents } from "bullmq";
import { createQueue } from "../queue";
import { createConnection } from "../create-connection";

interface PaymentSubject {
	name: string;
	cin: string;
	vatId: string;
	address: {
		city: string;
		country: string;
		streetLine1: string,
		streetLine2?: string;
		postalCode: string;
		state?: string;
	};
}

interface GenerateInvoiceItem {
	name: string;
	/**
	 * Pri,ce is in pennies so you must multiply it by 100
	 * VAT must be already included
	 */
	price: number;
	amount: number;
}

export interface GenerateInvoice {
	/**
	 * Invoice data
	 */
	id: number;
	textId: string;

	supplier: PaymentSubject;
	subscriber: PaymentSubject;

	payment: {
		iban?: string;
		swift?: string;
		variableSymbol: string;
		amount: number;
		bankAccount?: string;
	};

	items: GenerateInvoiceItem[];

	/**
	 * ISO 4217
	 */
	currency: string;

	// cs, en
	language: string;
}

export type GenerateInvoiceResult =
	| { success: true }
	| {
		success: false;
		error: string;
	};

type InvoiceQueueEvent<Event extends string, Data> = {
	type: Event;
	data: Data;
};

// Queue data types
export type InvoiceQueueDataType = InvoiceQueueEvent<
	"generate-invoice",
	GenerateInvoice
>;

export type InvoiceQueueResultType =
	| {
		ok: false;
	}
	| { ok: true; filePath: string, fileId: string, id: number };

// Define queues here at the moment
export const InvoiceQueue = createQueue<
	InvoiceQueueDataType,
	InvoiceQueueResultType,
	""
>("Invoices");

export const InvoiceQueueEvents = new QueueEvents("Invoices", { connection: createConnection() });