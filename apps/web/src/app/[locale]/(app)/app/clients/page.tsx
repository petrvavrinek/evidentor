"use client";

import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@evidentor/ui/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@evidentor/ui/components/ui/dialog";

import { ClientForm } from "@/components/clients/client-form";
import PageHeader from "@/components/page-header";
import SearchInput from "@/components/search-input";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import ClientDetailDialog from "@/components/clients/client-detail-dialog";
import QueryDataTable, { QueryDataTableMeta } from "@/components/query-data-table";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import useTitle from "@/hooks/use-title";
import { type Client, getClients } from "@/lib/api";
import {
	deleteClientsByIdMutation,
	getClientsQueryKey,
	postClientsMutation,
} from "@/lib/api/@tanstack/react-query.gen";

export default function ClientsPage() {
	const t = useTranslations("app.pages.clients");
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const [clientDetail, setClientDetail] = useState<Client>();

	useTitle(t("title"));

	const createClientMutation = useMutation(postClientsMutation());
	const deleteClientMutation = useMutation(deleteClientsByIdMutation());

	const columns: ColumnDef<Client>[] = [
		{
			accessorKey: "companyName",
			header: "Name"
		},
		{
			accessorKey: "contactName",
			header: "Contact"
		},
		{
			accessorKey: "email",
			header: "Contact email"
		},
		{
			id: "options",
			cell: ({
				row,
				table
			}) => (
				<TableItemDetailMenu
					onDelete={async () => {
						await deleteClientMutation.mutateAsync({
							path: { id: row.original.id }
						});
						const meta = table.options.meta as QueryDataTableMeta<Client>;
						meta.removeRow(row.original);
					}}
				/>
			)
		}
	]

	return (
		<>
			<PageHeader
				title="Clients"
				subtitle="Manage your client relationships"
				controls={
					<Button
						className="mt-4 md:mt-0"
						onClick={() => setIsCreateDialogOpen(true)}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Client
					</Button>
				}
			/>

			<div className="flex flex-col md:flex-row gap-4 my-5">
				<SearchInput
					placeholder="Search clients..."
					className="pl-8 w-full"
					containerClassName="flex-1"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<Card>
				<CardHeader className="px-6">
					<CardTitle>Client List</CardTitle>
				</CardHeader>
				<CardContent className="px-6">
					<QueryDataTable
						columns={columns}
						queryFn={getClients}
						queryKey={getClientsQueryKey()}
						pagination={{ pageSize: 16 }}
					/>
				</CardContent>
			</Card>

			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} >
				<DialogContent className="min-w-[500px]">
					<DialogHeader>
						<DialogTitle>Create new client</DialogTitle>
					</DialogHeader>
					<ClientForm
						onCancel={() => setIsCreateDialogOpen(false)}
						onSubmit={(e) => {
							createClientMutation.mutate(
								{ body: e },
								{ onSuccess: () => setIsCreateDialogOpen(false) },
							);
						}}
					/>
				</DialogContent>
			</Dialog>
			<ClientDetailDialog client={clientDetail} onClose={() => setClientDetail(undefined)} />
		</>
	);
}
