"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@evidentor/ui/components/ui/alert-dialog";
import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";

import PageHeader from "@/components/page-header";
import NewProjectModal from "@/components/projects/new-project-modal";
import ProjectsOverviewError from "@/components/projects/projects-overview-error";
import ProjectsOverviewLoading from "@/components/projects/projects-overview-loading";
import SearchInput from "@/components/search-input";

import ProjectDetailModal from "@/components/projects/project-detail-modal";
import QueryDataTable from "@/components/query-data-table";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import useTitle from "@/hooks/use-title";
import { deleteProjectsById, getProjects, type Project } from "@/lib/api";
import { getProjectsOptions, getProjectsQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";


export default function ProjectsPage() {
	const t = useTranslations("app.pages.projects");
	useTitle(t("title"));

	const { data: projects, isLoading, error } = useQuery({
		initialData: null,
		queryKey: getProjectsQueryKey(),
		queryFn: () => getProjects(),
	});

	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
	const [showProjectDetail, setShowProjectDetail] = useState<Project | null>(
		null,
	);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteProjectsById({ path: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProjectsQueryKey() });
			toast.info("Project deleted");
		},
		onError: () => {
			toast.error("Failed to delete project");
		},
	});

	const handleDelete = (id: number) => {
		const project = projects?.find((p) => p.id === id);
		if (project) {
			setProjectToDelete(project);
		}
	};

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
			cell: ({ row }) => {
				return (
					<TableItemDetailMenu
						onDelete={() => handleDelete(row.original.id)}
						onDetail={() => handleDetailShow(row.original)}
					/>
				);
			},
			size: 80
		}
	]


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

			{isLoading && <ProjectsOverviewLoading />}
			{error && <ProjectsOverviewError error={error} />}
			{!isLoading && !error && (
				<Card>
					<CardHeader className="px-6">
						<CardTitle>Project List</CardTitle>
						<CardDescription>
							{projects?.length} project{projects?.length !== 1 ? "s" : ""} found
						</CardDescription>
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
			)}
			<NewProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			<AlertDialog
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
									deleteMutation.mutate(projectToDelete.id);
								}
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<ProjectDetailModal
				project={showProjectDetail ?? undefined}
				isOpen={!!showProjectDetail}
				onClose={() => setShowProjectDetail(null)}
			/>
		</>
	);
}
