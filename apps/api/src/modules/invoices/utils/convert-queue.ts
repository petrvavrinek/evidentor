import type { InvoiceQueueDataType } from "@evidentor/queues";
import type { InvoiceSelectSchemaType } from "../invoice.schemas";

type GenerateInvoiceData = InvoiceQueueDataType["data"];

/**
 * Convert invoice schema to queue data type
 * @param invoice Invoice data
 * @returns
 */
export const convertInvoiceToQueueType = (
	invoice: InvoiceSelectSchemaType,
): GenerateInvoiceData => {
	return {
		currency: invoice.currency,
		id: invoice.id.toString(),
		items: invoice.items.map((e) => ({
			amount: e.qty,
			name: e.name,
			price: e.unitPrice,
		})),
		payment: {
			amount: invoice.amount,
			iban: "IBAN",
			swift: "SWIFT",
			variableSymbol: 1,
		},
		subscriber: {
			name: invoice.client?.companyName ?? "",
			address: {
				city: "city",
				country: "country",
				houseNumber: "hn",
				street: "street",
				zip: "zip",
			},
			cin: "cin",
			vatId: "vatId",
		},
		supplier: {
			name: "supplier",
			address: {
				city: "city",
				country: "country",
				houseNumber: "hn",
				street: "street",
				zip: "zip",
			},
			cin: "cin",
			vatId: "vatId",
		},
	};
};
