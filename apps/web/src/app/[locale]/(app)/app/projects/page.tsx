"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@evidentor/ui/components/ui/card";

import PageHeader from "@/components/page-header";
import NewProjectModal from "@/components/projects/new-project-modal";
import SearchInput from "@/components/search-input";

import ProjectDetailModal from "@/components/projects/project-detail-modal";
import QueryDataTable, { QueryDataTableMeta } from "@/components/query-data-table";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import useTitle from "@/hooks/use-title";
import { getProjects, type Project } from "@/lib/api";
import { deleteProjectsByIdMutation, getProjectsQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";


export default function ProjectsPage() {
	const t = useTranslations("app.pages.projects");
	useTitle(t("title"));

	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showProjectDetail, setShowProjectDetail] = useState<Project | null>(
		null,
	);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		...deleteProjectsByIdMutation(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProjectsQueryKey() });
			toast.info("Project deleted");
		},
		onError: () => {
			toast.error("Failed to delete project");
		},
	});

	const handleDetailShow = (project: Project) => {
		setShowProjectDetail(project);
	};

	const columns: ColumnDef<Project>[] = [
		{
			accessorKey: "title",
			header: "Title"
		},
		{
			accessorKey: "client.companyName",
			header: "Client",
		},
		{
			id: "actions",
			cell: ({ row, table }) => {
				return (
					<TableItemDetailMenu
						onDelete={async () => {
							const meta = table.options.meta as QueryDataTableMeta<Project>;
							await deleteMutation.mutateAsync({ path: { id: row.original.id }});
							meta.removeRow(row.original);
						}}
						onDetail={() => handleDetailShow(row.original)}
					/>
				);
			},
			size: 80
		}
	];

	return (
		<>
			<PageHeader
				title="Projects"
				subtitle="Manage your projects and track progress"
				controls={
					<Button className="mt-4 md:mt-0" onClick={() => setIsModalOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Add Project
					</Button>
				}
			/>

			<div className="flex flex-col md:flex-row gap-4 my-5">
				<SearchInput
					placeholder="Search projects..."
					containerClassName="flex-1"
					className="pl-8 w-full"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<Card>
				<CardHeader className="px-6">
					<CardTitle>Project List</CardTitle>
				</CardHeader>
				<CardContent className="px-6">
					<QueryDataTable
						queryFn={getProjects}
						queryKey={getProjectsQueryKey()}
						columns={columns}
						pagination={{ pageSize: 10 }}
					/>
				</CardContent>
			</Card>

			<NewProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			{/* <AlertDialog
				open={!!projectToDelete}
				onOpenChange={(isOpen: boolean) => !isOpen && setProjectToDelete(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							project "{projectToDelete?.title || "Untitled Project"}".
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (projectToDelete) {
									deleteMutation.mutate();
								}
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog> */}
			<ProjectDetailModal
				project={showProjectDetail ?? undefined}
				isOpen={!!showProjectDetail}
				onClose={() => setShowProjectDetail(null)}
			/>
		</>
	);
}
