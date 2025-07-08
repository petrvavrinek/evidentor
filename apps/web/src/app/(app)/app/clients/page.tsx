"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@evidentor/ui/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";

import { ClientForm } from "@/components/clients/client-form";
import { ClientTableRow } from "@/components/clients/client-table-row";
import PageHeader from "@/components/page-header";
import SearchInput from "@/components/search-input";

import { type Client, getClient } from "@/lib/api";

import {
	deleteClientByIdMutation,
	getClientQueryKey,
	postClientMutation,
} from "@/lib/api/@tanstack/react-query.gen";

export default function ClientsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const {
		data: { data: clients = [] } = {},
		isLoading,
		refetch,
	} = useQuery({
		initialData: [] as never,
		queryKey: getClientQueryKey(),
		queryFn: () => getClient(),
	});

	const createClientMutation = useMutation({
		...postClientMutation(),
		onSuccess: () => refetch(),
	});

	const deleteClientMutation = useMutation({
		...deleteClientByIdMutation(),
		onSuccess: () => refetch(),
	});

	const handleDelete = (id: number) => {
		deleteClientMutation.mutateAsync({ path: { id } });
	};

	if (isLoading) return <>Loading...</>;

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
					<CardDescription>
						{clients.length} {clients.length === 1 ? "client" : "clients"} found
					</CardDescription>
				</CardHeader>
				<CardContent className="px-6">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Company</TableHead>
									<TableHead>Contact</TableHead>
									<TableHead className="hidden md:table-cell">Email</TableHead>
									<TableHead className="hidden md:table-cell">Phone</TableHead>
									<TableHead className="w-[80px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{clients.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-8 text-muted-foreground"
										>
											No clients found. Try adjusting your search or filters.
										</TableCell>
									</TableRow>
								) : (
									(clients as Client[]).map((client) => (
										<ClientTableRow
											key={client.id}
											client={client}
											onDelete={handleDelete}
										/>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create new client</DialogTitle>
					</DialogHeader>

					<ClientForm
						onCancel={() => setIsCreateDialogOpen(false)}
						onSubmit={(e) => {
							createClientMutation.mutate(
								{
									body: {
										companyName: e.contactName,
										contactName: e.contactName,
									},
								},
								{ onSuccess: () => setIsCreateDialogOpen(false) },
							);
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
