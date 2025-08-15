"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";

import InvoiceCreateModal from "@/components/invoices/invoice-create-modal";
import InvoiceDetailModal from "@/components/invoices/invoice-detail-modal";
import { InvoiceTableRow } from "@/components/invoices/invoice-table-row";
import PageHeader from "@/components/page-header";
import SearchInput from "@/components/search-input";

import useTitle from "@/hooks/use-title";
import type { Invoice } from "@/lib/api";
import { getInvoicesQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { deleteInvoicesById, getInvoices } from "@/lib/api/sdk.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InvoicesPage() {
	const t = useTranslations("app.pages.invoices");
	useTitle(t("title"));

	const {
		data: invoices,
		isLoading,
		error,
		refetch,
	} = useQuery({
		initialData: null,
		queryKey: getInvoicesQueryKey(),
		queryFn: () => getInvoices(),
	});

	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [createOpen, setCreateOpen] = useState(false);
	const handleDelete = (id: number) => {
		deleteInvoicesById({ path: { id } }).then(() => refetch());
	};
	const handleCloseModal = () => setSelectedInvoice(null);

	return (
		<>
			<PageHeader
				title="Invoices"
				subtitle="Manage your invoices"
				controls={
					<Button className="mt-4 md:mt-0" onClick={() => setCreateOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create invoice
					</Button>
				}
			/>

			<div className="flex flex-col md:flex-row gap-4 my-5">
				<SearchInput
					placeholder="Search invoices..."
					className="pl-8 w-full"
					containerClassName="flex-1"
				/>
			</div>
			<Card>
				<CardHeader className="px-6">
					<CardTitle>Invoice List</CardTitle>
					<CardDescription>
						{isLoading
							? "Loading..."
							: error
								? "Failed to load invoices"
								: `${invoices?.data?.length ?? 0} invoice${invoices?.data?.length !== 1 ? "s" : ""} found`}
					</CardDescription>
				</CardHeader>
				<CardContent className="px-6">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Invoice #</TableHead>
									<TableHead>Client</TableHead>
									<TableHead className="hidden md:table-cell">
										Project
									</TableHead>
									<TableHead className="hidden md:table-cell">
										Issue date
									</TableHead>
									<TableHead className="hidden md:table-cell">
										Due date
									</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-[100px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={8} className="text-center">
											Loading...
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell
											colSpan={8}
											className="text-center text-destructive"
										>
											{error instanceof Error ? error.message : String(error)}
										</TableCell>
									</TableRow>
								) : invoices?.data?.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="text-center">
											No invoices found
										</TableCell>
									</TableRow>
								) : (
									invoices?.data?.map((invoice) => (
										<InvoiceTableRow
											key={invoice.id}
											invoice={invoice}
											onDelete={() => handleDelete(invoice.id)}
											onViewDetails={() => setSelectedInvoice(invoice)}
										/>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
			<InvoiceDetailModal
				invoice={selectedInvoice}
				isOpen={!!selectedInvoice}
				onClose={handleCloseModal}
			/>
			<InvoiceCreateModal
				isOpen={createOpen}
				onClose={() => setCreateOpen(false)}
				onCreated={refetch}
			/>
		</>
	);
}
