// Simple translation utility. Extend as needed.
const translations: Record<string, string> = {
	invoice: "Invoice",
	invoice_id: "Invoice ID",
	supplier: "Supplier",
	subscriber: "Subscriber",
	payment_information: "Payment Information",
	iban: "IBAN",
	swift: "SWIFT",
	variable_symbol: "Variable Symbol",
	total: "Total",
	name: "Name",
	amount: "Amount",
	price: "Price",
	items_total: "Total",
	cin: "CIN",
	vat: "VAT",
	address: "Address",
};

export function t(key: string): string {
	return translations[key] || key;
}
