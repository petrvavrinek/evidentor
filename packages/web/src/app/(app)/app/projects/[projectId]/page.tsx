"use client";

import { useParams } from "next/navigation";
import { Loader, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import PageHeader from "@/components/page-header";
import TaskModal from "@/components/tasks/task-modal";
import TaskTable from "@/components/tasks/task-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectById, type ProjectTask } from "@/lib/api";
import {
	getProjectByIdQueryKey,
	getProjectTaskOptions,
} from "@/lib/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

export default function ProjectOverviewPage() {
	const params = useParams();
	const projectId = Number(params.projectId);

	const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
	const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

	const {
		data: project,
		isLoading: isProjectLoading,
		// isError: isProjectError,
	} = useQuery({
		queryKey: getProjectByIdQueryKey({ path: { id: projectId } }),
		queryFn: () => getProjectById({ path: { id: projectId } }),
	});

	const { data: tasks } = useQuery(getProjectTaskOptions());

	const allProjectTasks = useMemo(
		() => [...projectTasks, ...(tasks ?? [])],
		[projectTasks, tasks],
	);

	if (isProjectLoading) return <Loader />;
	if (!project?.data) return <>Project not found</>;

	const onProjectTaskCreate = (task: ProjectTask) => {
		setNewTaskDialogOpen(false);
		setProjectTasks([task, ...projectTasks]);
	};

	return (
		<>
			<PageHeader
				title={`Project Overview`}
				subtitle={project.data.title ?? ""}
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
						{tasks && <TaskTable tasks={allProjectTasks} />}
					</CardContent>
				</Card>

				<TaskModal
					open={newTaskDialogOpen}
					onClose={() => setNewTaskDialogOpen(false)}
					onCreate={onProjectTaskCreate}
					project={project.data}
				/>
			</div>
		</>
	);
}
