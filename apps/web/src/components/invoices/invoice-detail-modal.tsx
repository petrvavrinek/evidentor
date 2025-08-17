import { useNumberFormatter } from "@/hooks/use-number-formatter";
import type { Invoice } from "@/lib/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import { Dialog, DialogContent } from "@evidentor/ui/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";

interface InvoiceDetailModalProps {
	invoice?: Invoice | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function InvoiceDetailModal({
	invoice,
	isOpen,
	onClose,
}: InvoiceDetailModalProps) {
	const numberFormatter = useNumberFormatter({
		style: "currency",
		currency: invoice?.currency?.toUpperCase() ?? "eur"
	})

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl">
				{invoice && (
					<Card>
						<CardHeader>
							<CardTitle>
								Invoice #{invoice.id.toString().padStart(4, "0")}
							</CardTitle>
							<CardDescription>
								Client: {invoice.client?.companyName || "-"} <br />
								{/* Project: {invoice.project?.title || "-"} <br /> */}
								Issued:{" "}
								{invoice.issuedAt
									? new Date(invoice.issuedAt as string).toLocaleDateString()
									: "-"}{" "}
								<br />
								Due:{" "}
								{invoice.dueDate
									? new Date(invoice.dueDate as string).toLocaleDateString()
									: "-"}{" "}
								<br />
								Paid:{" "}
								{invoice.paidAt
									? new Date(invoice.paidAt as string).toLocaleDateString()
									: "-"}{" "}
								<br />
								Status: {invoice.paidAt ? "Paid" : "Unpaid"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Item</TableHead>
										<TableHead>Qty</TableHead>
										<TableHead>Unit Price</TableHead>
										<TableHead>Total</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{invoice.items.map((item) => (
										<TableRow key={item.id}>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.qty}</TableCell>
											<TableCell>
												{numberFormatter.format(item.unitPrice)}
											</TableCell>
											<TableCell>
												{numberFormatter.format(item.unitPrice * item.qty)}
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell colSpan={3} className="text-right font-bold">
											Total
										</TableCell>
										<TableCell className="font-bold">
											{numberFormatter.format(invoice.amount)}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
			</DialogContent>
		</Dialog>
	);
}
