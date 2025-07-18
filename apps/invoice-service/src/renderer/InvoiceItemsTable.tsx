import type { InvoiceQueueDataType } from "@evidentor/queues";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

import CurrencyAmount from "./CurrencyAmount";
import { t } from "./translations";

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
});

export const InvoiceItemsTable = ({
	items,
	currency,
	language,
}: {
	items: GenerateInvoiceData["items"];
	currency: string;
	language: string;
}) => (
	<View style={styles.root}>
		<View style={styles.header}>
			<Text style={[styles.headerCell, styles.name]}>{t("name")}</Text>
			<Text style={[styles.headerCell, styles.amount]}>{t("amount")}</Text>
			<Text style={[styles.headerCell, styles.price]}>{t("price")}</Text>
			<Text style={[styles.headerCell, styles.total]}>{t("items_total")}</Text>
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
						amount={(item.price * item.amount) / 100}
						language={language}
						currency={currency}
					/>
				</Text>
			</View>
		))}
	</View>
);
