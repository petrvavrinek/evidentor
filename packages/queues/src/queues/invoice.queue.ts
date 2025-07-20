import { createQueue } from "../queue";

interface PaymentSubject {
	name: string;
	cin: string;
	vatId: string;
	address: {
		city: string;
		country: string;
		houseNumber: string;
		street: string;
		zip: string;
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
	id: string;

	supplier: PaymentSubject;
	subscriber: PaymentSubject;

	payment: {
		iban: string;
		swift: string;
		variableSymbol: number;
		amount: number;
	};

	items: GenerateInvoiceItem[];

	/**
	 * ISO 4217
	 */
	currency: string;
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
	| { ok: true; filePath: string };

// Define queues here at the moment
export const InvoiceQueue = createQueue<
	InvoiceQueueDataType,
	InvoiceQueueResultType,
	""
>("Invoices");
