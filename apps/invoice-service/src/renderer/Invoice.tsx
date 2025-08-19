import type { InvoiceQueueDataType } from "@evidentor/queues";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PaymentSubjectBlock } from "./PaymentSubjectBlock";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import CurrencyAmount from "./CurrencyAmount";
import { getTranslations, type Language } from "../translations";


type GenerateInvoiceData = InvoiceQueueDataType["data"];

const styles = StyleSheet.create({
	page: {
		padding: 32,
		backgroundColor: "#fff",
	},
	header: {
		marginBottom: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	id: {
		fontSize: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 16,
	},
	col: {
		flex: 1,
	},
	colLeft: {
		marginRight: 8,
	},
	colRight: {
		marginLeft: 8,
	},
	payment: {
		marginBottom: 16,
		fontSize: 11,
	},
	paymentTitle: {
		fontWeight: "bold",
		fontSize: 12,
		marginBottom: 2,
	},
	paymentTotal: {
		fontWeight: "bold",
		marginTop: 4,
	},
});

export const InvoiceDocument = ({
	currency,
	id,
	items,
	payment,
	subscriber,
	supplier,
	language
}: GenerateInvoiceData) => {
	const translations = getTranslations(language as Language);
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>{translations.invoice}</Text>
					<Text style={styles.id}>
						{translations.invoice_id}: {id}
					</Text>
				</View>
				{/* Supplier & Subscriber */}
				<View style={styles.row}>
					<View style={[styles.col, styles.colLeft]}>
						<PaymentSubjectBlock title={translations.supplier} subject={supplier} translations={translations} />
					</View>
					<View style={[styles.col, styles.colRight]}>
						<PaymentSubjectBlock title={translations.subscriber} subject={subscriber} translations={translations} />
					</View>
				</View>
				{/* Payment Info */}
				<View style={styles.payment}>
					<Text style={styles.paymentTitle}>{translations.payment_information}</Text>
					<Text>
						{translations.iban}: {payment.iban}
					</Text>
					<Text>
						{translations.swift}: {payment.swift}
					</Text>
					<Text>
						{translations.variable_symbol}: {payment.variableSymbol}
					</Text>
					<Text style={styles.paymentTotal}>
						<CurrencyAmount
							currency={currency}
							language={language}
							amount={payment.amount / 100}
						/>
					</Text>
				</View>
				{/* Items Table */}
				<InvoiceItemsTable items={items} currency={currency} language={language as Language} translations={translations} />
			</Page>
		</Document>
	)
}
