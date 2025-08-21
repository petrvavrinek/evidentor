"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";

import PageHeader from "@/components/page-header";
import TaskModal from "@/components/tasks/task-modal";

import QueryDataTable from "@/components/query-data-table";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import EditTaskModal from "@/components/tasks/edit-task-modal";
import { getProjectsById, getProjectTasks, type ProjectTask } from "@/lib/api";
import {
	deleteProjectTasksByIdMutation,
	getProjectsByIdQueryKey,
	getProjectTasksQueryKey
} from "@/lib/api/@tanstack/react-query.gen";
import { ColumnDef } from "@tanstack/react-table";

export default function ProjectOverviewPage() {
	const params = useParams();
	const projectId = Number(params.id);

	const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
	const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
	const [editTask, setEditTask] = useState<ProjectTask>();

	const {
		data: project,
		isLoading: isProjectLoading,
		// isError: isProjectError,
	} = useQuery({
		queryKey: getProjectsByIdQueryKey({ path: { id: projectId } }),
		queryFn: () => getProjectsById({ path: { id: projectId } }),
	});
	const deleteProjectTaskMutation = useMutation(deleteProjectTasksByIdMutation());

	if (isProjectLoading) return <Loader />;
	if (!project) return "Project not found";

	const onProjectTaskCreate = (task: ProjectTask) => {
		setNewTaskDialogOpen(false);
		setProjectTasks([task, ...projectTasks]);
	};

	const columns: ColumnDef<ProjectTask>[] = [
		{
			accessorKey: "title",
			header: "Title"
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			id: "actions",
			cell: ({ row, table }) => (
				<TableItemDetailMenu
					onEdit={() => setEditTask(row.original)}
					onDelete={() => {
						deleteProjectTaskMutation.mutate({ path: { id: row.original.id } })
					}}
				/>)
		}
	]

	return (
		<>
			<PageHeader
				title={`Project Overview`}
				subtitle={project.title ?? ""}
			/>
			<div className="space-y-6">
				<Card>
					<CardHeader className="w-full">
						<CardTitle className="w-full flex items-center">
							<div>Project Tasks</div>
							<Button
								className="ml-auto"
								onClick={() => setNewTaskDialogOpen(true)}
							>
								<Plus />
								Add task
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<QueryDataTable
							columns={columns}
							pagination={{ pageSize: 16 }}
							queryFn={getProjectTasks}
							queryKey={getProjectTasksQueryKey({ query: { project: projectId }})}
							queryOptions={{ query: { project: projectId} } as never}
						/>
					</CardContent>
				</Card>

				<TaskModal
					open={newTaskDialogOpen}
					onClose={() => setNewTaskDialogOpen(false)}
					onCreate={onProjectTaskCreate}
					project={project}
				/>
				{
					editTask && (
						<EditTaskModal
							task={editTask}
							open
							onClose={() => setEditTask(undefined)}
							onUpdate={() => { }}
						/>
					)
				}

			</div>
		</>
	);
}
