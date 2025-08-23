"use client";

import { useQuery } from "@tanstack/react-query";
import { type Key, useCallback, useEffect, useRef, useState } from "react";

import { type Project } from "@/lib/api";
import { getProjectsOptions } from "@/lib/api/@tanstack/react-query.gen";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@evidentor/ui/components/ui/select";
import { Skeleton } from "@evidentor/ui/components/ui/skeleton";

interface ProjectSelectProps {
	/**
	 * Ref should be defined, otherwise it can lead to invalid project indices
	 */
	ref?: Key;
	/**
	 * Called on project select
	 * @param project Selected project
	 * @returns
	 */
	onSelect?: (project: Project) => void;
	/**
	 * Should be select disabled?
	 */
	disabled?: boolean;
	/**
	 * Select ID for Label usage
	 */
	id?: string;

	/**
	 * Default selected project ID
	 */
	projectId?: Project["id"];
}

/**
 * Component that allows to dynamically load projects
 * @param props Component props
 * @returns
 */
export const ProjectSelect = (props: ProjectSelectProps) => {
	const { data: projects, isLoading } = useQuery(getProjectsOptions());

	const [selectedProjectIdx, setSelectedProjectIdx] = useState<
		number | undefined
	>(undefined);

	// Use ref to track if we've initialized from projectId to prevent loops
	const hasInitialized = useRef(false);

	// Use ref to store the last called onSelect to prevent unnecessary calls
	const lastSelectedProject = useRef<Project | null>(null);

	// Initialize selectedProjectIdx from projectId when projects are loaded
	useEffect(() => {
		if (!projects || hasInitialized.current) return;

		if (props.projectId) {
			const foundProjectIdx = projects.findIndex(
				(project) => project.id === props.projectId,
			);

			if (foundProjectIdx >= 0) {
				setSelectedProjectIdx(foundProjectIdx);
			}
		}

		hasInitialized.current = true;
	}, [props.projectId, projects]);

	// Reset initialization flag when projectId changes
	useEffect(() => {
		hasInitialized.current = false;
		lastSelectedProject.current = null;
	}, [props.projectId]);

	// Call onSelect when selectedProjectIdx changes, but avoid unnecessary calls
	useEffect(() => {
		if (selectedProjectIdx === undefined || !projects || !props.onSelect) {
			return;
		}

		const selectedProject = projects[selectedProjectIdx];

		// Only call onSelect if the project actually changed
		if (selectedProject && selectedProject !== lastSelectedProject.current) {
			lastSelectedProject.current = selectedProject;
			props.onSelect(selectedProject);
		}
	}, [selectedProjectIdx, projects, props.onSelect]);

	const handleValueChange = useCallback((value: string) => {
		if (value.trim().length) {
			setSelectedProjectIdx(Number.parseInt(value, 10));
		}
	}, []);

	if (isLoading) return <Skeleton className="rounded-md w-full h-[36px]" />;


	return (
		<Select
			value={selectedProjectIdx !== undefined ? `${selectedProjectIdx}` : ""}
			disabled={props.disabled || isLoading}
			onValueChange={handleValueChange}
		>
			<SelectTrigger id={props.id ?? "project"} className="w-full h-[36px]">
				<SelectValue placeholder="Select a project" />
			</SelectTrigger>
			<SelectContent>
				{projects?.map((project, idx) => (
					<SelectItem key={project.id} value={`${idx}`}>
						{project.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};