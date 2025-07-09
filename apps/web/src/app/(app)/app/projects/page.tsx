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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";

import PageHeader from "@/components/page-header";
import NewProjectModal from "@/components/projects/new-project-modal";
import ProjectTableRow from "@/components/projects/project-table-row";
import ProjectsOverviewError from "@/components/projects/projects-overview-error";
import ProjectsOverviewLoading from "@/components/projects/projects-overview-loading";
import SearchInput from "@/components/search-input";

import { deleteProjectById, getProject, type Project } from "@/lib/api";
import { getProjectQueryKey } from "@/lib/api/@tanstack/react-query.gen";

export default function ProjectsPage() {
	const { data, isLoading, error } = useQuery({
		initialData: null,
		queryKey: getProjectQueryKey(),
		queryFn: () => getProject(),
	});

	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteProjectById({ path: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
			toast.info("Project deleted");
		},
		onError: () => {
			toast.error("Failed to delete project");
		},
	});

	const handleDelete = (id: number) => {
		const project = projects.find((p) => p.id === id);
		if (project) {
			setProjectToDelete(project);
		}
	};

	const handleUpdate = (id: number) => {
		// TODO: Implement update functionality
		console.log(`Update project ${id}`);
	};

	const projects = data?.data || [];

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
							{projects.length} project{projects.length !== 1 ? "s" : ""} found
						</CardDescription>
					</CardHeader>
					<CardContent className="px-6">
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Project</TableHead>
										<TableHead>Client</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="hidden md:table-cell">
											Priority
										</TableHead>
										<TableHead className="hidden lg:table-cell">
											Deadline
										</TableHead>
										<TableHead className="hidden lg:table-cell">
											Progress
										</TableHead>
										<TableHead className="w-[80px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{projects.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={7}
												className="text-center py-8 text-muted-foreground"
											>
												No projects found.
											</TableCell>
										</TableRow>
									) : (
										projects.map((project: Project) => (
											<ProjectTableRow
												key={project.id}
												project={project}
												onUpdate={handleUpdate}
												onDelete={handleDelete}
											/>
										))
									)}
								</TableBody>
							</Table>
						</div>
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
		</>
	);
}
