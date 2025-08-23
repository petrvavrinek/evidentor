"use client";

import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/page-header";
import QueryDataTable, { QueryDataTableMeta } from "@/components/query-data-table";
import SearchInput from "@/components/search-input";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import useTitle from "@/hooks/use-title";
import { Invoice } from "@/lib/api";
import { deleteInvoicesByIdMutation, getInvoicesQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { getInvoices } from "@/lib/api/sdk.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@evidentor/ui/components/ui/card";

export default function InvoicesPage() {
	const t = useTranslations("app.pages.invoices");
	useTitle(t("title"));
	const router = useRouter();
	const locale = useLocale();

	const deleteInvoiceMutation = useMutation(deleteInvoicesByIdMutation());

	const handleDelete = (id: number) => {
		deleteInvoiceMutation.mutate({ path: { id } });
	};

	const invoiceColumns: ColumnDef<Invoice>[] = [
		{
			accessorKey: "textId",
			header: "ID",
			size: 80
		},
		{
			accessorKey: "project.title",
			header: "Project title"
		},
		{
			accessorKey: "client.companyName",
			header: "Client"
		},
		{
			accessorKey: "amount",
			header: "Amount",
			size: 120,
			cell: ({ row }) => {
				const intl = new Intl.NumberFormat(locale, {
					currency: row.original.currency, style: "currency"
				});
				return intl.format(row.original.amount);
			}
		},
		{
			id: "options",
			cell: ({ row, table }) => (
				<TableItemDetailMenu
					onDetail={() => router.push(`detail/${row.original.id}`)}
					onDelete={async () => {
						const meta = table.options.meta as QueryDataTableMeta<Invoice>;
						await deleteInvoiceMutation.mutateAsync({ path: { id: row.original.id } });
						meta.removeRow(row.original);
					}}
				/>
			)
		}
	]

	return (
		<>
			<PageHeader
				title="Invoices"
				subtitle="Manage your invoices"
				controls={
					<Button className="mt-4 md:mt-0" onClick={() => router.push("new")}>
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
				</CardHeader>
				<CardContent className="px-6">
					<QueryDataTable
						queryFn={getInvoices}
						columns={invoiceColumns}
						queryKey={getInvoicesQueryKey()}
						pagination={{ pageSize: 16 }}
					/>
				</CardContent>
			</Card>
		</>
	);
}
