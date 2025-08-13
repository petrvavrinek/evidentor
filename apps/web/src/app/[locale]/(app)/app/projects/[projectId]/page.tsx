"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";

import PageHeader from "@/components/page-header";
import TaskModal from "@/components/tasks/task-modal";
import TaskTable from "@/components/tasks/task-table";

import { getProjectById, type ProjectTask } from "@/lib/api";
import {
	getProjectByIdQueryKey,
	getProjectTaskOptions,
} from "@/lib/api/@tanstack/react-query.gen";
import EditTaskModal from "@/components/tasks/edit-task-modal";

export default function ProjectOverviewPage() {
	const params = useParams();
	const projectId = Number(params.projectId);

  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
	const [editTask, setEditTask] = useState<ProjectTask>();

  // Update a task in local state
  const handleTaskUpdate = (updatedTask: ProjectTask) => {
    setProjectTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === updatedTask.id);
      if (idx === -1) return prev;
      const newTasks = [...prev];
      newTasks[idx] = updatedTask;
      return newTasks;
    });
  };

	const {
		data: project,
		isLoading: isProjectLoading,
		// isError: isProjectError,
	} = useQuery({
		queryKey: getProjectByIdQueryKey({ path: { id: projectId } }),
		queryFn: () => getProjectById({ path: { id: projectId } }),
	});

	const { data: tasks } = useQuery(getProjectTaskOptions());

  // Prefer local edits, then remote
  const allProjectTasks = useMemo(() => {
    const remoteTasks = (tasks ?? []).filter(rt => !projectTasks.some(lt => lt.id === rt.id));
    return [...projectTasks, ...remoteTasks];
  }, [projectTasks, tasks]);

	if (isProjectLoading) return <Loader />;
	if (!project?.data) return "Project not found";

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
						{tasks && <TaskTable tasks={allProjectTasks} onTaskUpdate={setEditTask} />}
					</CardContent>
				</Card>

				<TaskModal
					open={newTaskDialogOpen}
					onClose={() => setNewTaskDialogOpen(false)}
					onCreate={onProjectTaskCreate}
					project={project.data}
				/>
				{
					editTask && (
						<EditTaskModal
							task={editTask}
							open
							onClose={() => setEditTask(undefined)}
							onUpdate={handleTaskUpdate}
						/>
					)
				}
				
			</div>
		</>
	);
}
