import type { InvoiceQueueDataType } from "@evidentor/queues";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { t } from "./translations";

type GenerateInvoiceData = InvoiceQueueDataType["data"];

const styles = StyleSheet.create({
	root: { marginBottom: 8 },
	title: { fontWeight: "bold", fontSize: 12, marginBottom: 2 },
	line: { fontSize: 11 },
	address: { fontSize: 11 },
	info: { fontSize: 11},
});

export const PaymentSubjectBlock = ({
	title,
	subject,
}: {
	title: string;
	subject: GenerateInvoiceData["supplier"];
}) => (
	<View style={styles.root}>
		<Text style={styles.title}>{t(title)}</Text>
		<Text style={styles.line}>{subject.name}</Text>
		<Text style={styles.address}>
			{subject.address.street} {subject.address.houseNumber}
		</Text>
		<Text style={styles.address}>
			{subject.address.zip} {subject.address.city}, {subject.address.country}
		</Text>
		<Text style={styles.info}>
			{t("cin")}: {subject.cin} {t("vat")}: {subject.vatId}
		</Text>
	</View>
);
