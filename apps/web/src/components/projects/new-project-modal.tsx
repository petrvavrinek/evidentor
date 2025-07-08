"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { postProject } from "@/lib/api";
import { getProjectQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import type {
	PostProjectData,
	PostProjectResponse,
	Project,
} from "@/lib/api/types.gen";

import NewProjectForm from "./new-project-form";

interface NewProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function NewProjectModal({
	isOpen,
	onClose,
}: NewProjectModalProps) {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation<
		PostProjectResponse,
		Error,
		PostProjectData["body"]
	>({
		mutationFn: async (variables) => {
			const { data, error } = await postProject({ body: variables });
			if (error) {
				// biome-ignore lint/suspicious/noExplicitAny: Remove this
				throw new Error((error as any).detail || "Failed to create project");
			}
			return data as Project;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getProjectQueryKey() });
			toast.info("Project addded");
			onClose();
		},
		onError: () => {
			toast.error("Could not create new project");
		},
	});

	const handleSubmit = (data: { title: string; clientId: number | null }) => {
		if (!data.clientId) {
			// TODO: Implement user-friendly validation in the form
			alert("Please select a client");
			return;
		}
		mutate({ title: data.title, clientId: data.clientId });
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Project</DialogTitle>
				</DialogHeader>
				<NewProjectForm onSubmit={handleSubmit} isSubmitting={isPending} />
			</DialogContent>
		</Dialog>
	);
}
