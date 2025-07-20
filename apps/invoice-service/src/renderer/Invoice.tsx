import type { InvoiceQueueDataType } from "@evidentor/queues";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PaymentSubjectBlock } from "./PaymentSubjectBlock";
import { InvoiceItemsTable } from "./InvoiceItemsTable";
import { t } from "./translations";
import CurrencyAmount from "./CurrencyAmount";

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
}: GenerateInvoiceData) => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>{t("invoice")}</Text>
				<Text style={styles.id}>
					{t("invoice_id")}: {id}
				</Text>
			</View>
			{/* Supplier & Subscriber */}
			<View style={styles.row}>
				<View style={[styles.col, styles.colLeft]}>
					<PaymentSubjectBlock title={t("supplier")} subject={supplier} />
				</View>
				<View style={[styles.col, styles.colRight]}>
					<PaymentSubjectBlock title={t("subscriber")} subject={subscriber} />
				</View>
			</View>
			{/* Payment Info */}
			<View style={styles.payment}>
				<Text style={styles.paymentTitle}>{t("payment_information")}</Text>
				<Text>
					{t("iban")}: {payment.iban}
				</Text>
				<Text>
					{t("swift")}: {payment.swift}
				</Text>
				<Text>
					{t("variable_symbol")}: {payment.variableSymbol}
				</Text>
				<Text style={styles.paymentTotal}>
					<CurrencyAmount
						currency={currency}
						language="cs-CZ"
						amount={payment.amount / 100}
					/>
				</Text>
			</View>
			{/* Items Table */}
			<InvoiceItemsTable items={items} currency={currency} language="cs-CZ" />
		</Page>
	</Document>
);
