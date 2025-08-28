import type { InvoiceQueueDataType } from "@evidentor/queues";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getTranslations, type Language } from "../translations";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { PaymentSubjectBlock } from "./PaymentSubjectBlock";


type GenerateInvoiceData = InvoiceQueueDataType["data"];

Font.register({
	family: "Roboto",
	fonts: [
		{ src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
		{ src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
		{ src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
		{ src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 600 },
	],
})

const styles = StyleSheet.create({
	page: {
		padding: 32,
		backgroundColor: "#fff",
		fontFamily: "Roboto"
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
	textId,
	items,
	payment,
	subscriber,
	supplier,
	language
}: GenerateInvoiceData) => {
	const translations = getTranslations(language as Language);
	const updatedItems = items.map(e => {
		e.price /= 100;
		return e;
	})

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>{translations.invoice}</Text>
					<Text style={styles.id}>
						{translations.invoiceId}: {textId}
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
					<Text style={styles.paymentTitle}>{translations.paymentInformation}</Text>
					{payment.bankAccount && <Text>{translations.bankAccount}: {payment.bankAccount}</Text>}
					{payment.iban && <Text>{translations.iban}: {payment.iban}</Text>}
					{payment.swift && <Text>{translations.swift}: {payment.swift}</Text>}
					{payment.variableSymbol && <Text>{translations.variableSymbol}: {payment.variableSymbol}</Text>}
				</View>
				{/* Items Table */}
				<InvoiceItemsTable items={updatedItems} currency={currency} language={language as Language} translations={translations} />
			</Page>
		</Document>
	)
}
