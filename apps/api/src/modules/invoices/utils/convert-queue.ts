import type { InvoiceQueueDataType } from "@evidentor/queues";

import type { InvoiceSelectSchemaType } from "../invoice.schemas";
import type { UserBillingResponse } from "../../user-billing/user-billing.schema";

type GenerateInvoiceData = InvoiceQueueDataType["data"];

/**
 * Convert invoice schema to queue data type
 * @param invoice Invoice data
 * @returns
 */
export const convertInvoiceToQueueType = (
	invoice: InvoiceSelectSchemaType,
	userBilling: UserBillingResponse
): GenerateInvoiceData | null => {
	if (!invoice.client) return null;
	if (!invoice.client.address) return null;

	return {
		currency: invoice.currency,
		id: invoice.textId,
		items: invoice.items.map((e) => ({
			amount: e.qty,
			name: e.name,
			price: e.unitPrice,
		})),
		payment: {
			amount: invoice.amount,
			bankAccount: userBilling.bankAccount,
			variableSymbol: invoice.textId,
		},
		subscriber: {
			name: invoice.client.companyName,
			address: {
				city: invoice.client.address.city,
				country: invoice.client.address.country,
				streetLine1: invoice.client.address.streetLine1,
				streetLine2: invoice.client.address.streetLine2 ?? undefined,
				postalCode: invoice.client.address.postalCode ?? "",
			},
			cin: "cin",
			vatId: "vatId",
		},
		supplier: {
			name: userBilling.companyName,
			address: {
				city: userBilling.address.city,
				country: userBilling.address.country,
				streetLine1: userBilling.address.streetLine1,
				streetLine2: userBilling.address.streetLine2 ?? undefined,
				postalCode: userBilling.address.postalCode ?? "",
			},
			cin: "cin",
			vatId: "vatId",
		},
		language: invoice.language
	};
};
