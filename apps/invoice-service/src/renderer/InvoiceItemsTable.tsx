import type { InvoiceQueueDataType } from "@evidentor/queues";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

import CurrencyAmount from "./CurrencyAmount";
import type { Language, Translations } from "../translations";

type GenerateInvoiceData = InvoiceQueueDataType["data"];

const styles = StyleSheet.create({
	root: { marginTop: 12 },
	header: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#000",
		paddingBottom: 4,
		fontSize: 12,
	},
	headerCell: { fontWeight: "bold" },
	name: { flex: 4 },
	amount: { flex: 1, textAlign: "right" },
	price: { flex: 2, textAlign: "right" },
	total: { flex: 2, textAlign: "right" },
	row: {
		flexDirection: "row",
		paddingVertical: 2,
		borderBottomWidth: 0.5,
		borderBottomColor: "#ccc",
		fontSize: 11,
	},
	rowTotal: {
		borderBottom: 0
	},
	columnTotal: {
		borderBottomWidth: 0.5,
		borderBottomColor: "#ccc",
	}
});

export const InvoiceItemsTable = ({
	items,
	currency,
	translations,
	language
}: {
	items: GenerateInvoiceData["items"];
	currency: string;
	translations: Translations,
	language: Language
}) => {
	const totalAmount = items.reduce((prev, current) => prev + current.amount * current.price, 0);

	return (
		<View style={styles.root}>
			<View style={styles.header}>
				<Text style={[styles.headerCell, styles.name]}>{translations.name}</Text>
				<Text style={[styles.headerCell, styles.amount]}>{translations.amount}</Text>
				<Text style={[styles.headerCell, styles.price]}>{translations.price}</Text>
				<Text style={[styles.headerCell, styles.total]}>{translations.itemsTotal}</Text>
			</View>
			{items.map((item) => (
				<View key={`${item.name}_${item.amount}`} style={styles.row}>
					<Text style={styles.name}>{item.name}</Text>
					<Text style={styles.amount}>{item.amount}</Text>
					<Text style={styles.price}>
						<CurrencyAmount
							amount={item.price}
							language={language}
							currency={currency}
						/>
					</Text>
					<Text style={styles.total}>
						<CurrencyAmount
							amount={(item.price * item.amount)}
							language={language}
							currency={currency}
						/>
					</Text>
				</View>
			))}
			<View style={[styles.row, styles.rowTotal]}>
				<Text style={styles.name}></Text>
				<Text style={styles.amount}></Text>
				<Text style={styles.price}></Text>
				<Text style={[styles.total, styles.columnTotal]}>
					<CurrencyAmount amount={totalAmount} language={language} currency={currency} />
				</Text>
			</View>
		</View>
	)
};
