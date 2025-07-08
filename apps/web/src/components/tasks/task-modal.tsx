"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
} from "@evidentor/ui/components/ui/dialog";

import type { Project, ProjectTask } from "@/lib/api";
import { postProjectTaskByIdMutation } from "@/lib/api/@tanstack/react-query.gen";

import NewTaskForm from "./new-task-form";

interface TaskModalProps {
	open: boolean;
	onClose?: () => void;
	project: Project;
	onCreate?: (task: ProjectTask) => void;
}

export default function TaskModal({
	open,
	onClose,
	project,
	onCreate,
}: TaskModalProps) {
	const createTask = useMutation({
		...postProjectTaskByIdMutation(),
	});

	const onTaskCreated = (title: string, description: string) => {
		createTask
			.mutateAsync({
				path: {
					id: project.id,
				},
				body: {
					title,
					description,
				},
			})
			.then((e) => {
				onCreate?.(e);
			})
			.catch(() => {
				toast.error("Could not create project task");
			});
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>Add New Task</DialogHeader>
				<NewTaskForm
					onSubmit={onTaskCreated}
					isSubmitting={createTask.isPending}
				/>
			</DialogContent>
		</Dialog>
	);
}
