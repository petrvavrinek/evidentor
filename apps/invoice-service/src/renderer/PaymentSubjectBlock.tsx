import type { InvoiceQueueDataType } from "@evidentor/queues";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Translations } from "../translations";

type GenerateInvoiceData = InvoiceQueueDataType["data"];

const styles = StyleSheet.create({
	root: { marginBottom: 8 },
	title: { fontWeight: "bold", fontSize: 12, marginBottom: 2 },
	line: { fontSize: 11 },
	address: { fontSize: 11 },
	info: { fontSize: 11 },
});

export const PaymentSubjectBlock = ({
	title,
	subject,
	translations
}: {
	title: string;
	subject: GenerateInvoiceData["supplier"];
	translations: Translations
}) => (
	<View style={styles.root}>
		<Text style={styles.title}>{title}</Text>
		<Text style={styles.line}>{subject.name}</Text>
		<Text style={styles.address}>
			{subject.address.streetLine1}
		</Text>
		{
			subject.address.streetLine2 && <Text style={styles.address}>{subject.address.streetLine2}</Text>
		}
		<Text style={styles.address}>
			{subject.address.postalCode} {subject.address.city}, {subject.address.country}
		</Text>
		<Text style={styles.info}>
			{translations.cin}: {subject.cin} {translations.vat}: {subject.vatId}
		</Text>
	</View>
);
