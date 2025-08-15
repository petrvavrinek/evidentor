"use client";

import { useQuery } from "@tanstack/react-query";
import { type Key, useEffect, useState } from "react";

import { getProjects, type Project } from "@/lib/api";
import { getProjectsQueryKey } from "@/lib/api/@tanstack/react-query.gen";

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
	 * Ref should be defined, otherwise it can lead to invalid project idices
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
	const { data: projects, isLoading } = useQuery({
		queryFn: () => getProjects(),
		queryKey: getProjectsQueryKey(),
	});

	const [selectedProjectIdx, setSelectedProjectIdx] = useState<
		number | undefined
	>(undefined);

	useEffect(() => {
		if (selectedProjectIdx !== undefined && projects?.data)
			props.onSelect?.(projects.data[selectedProjectIdx]);
	}, [selectedProjectIdx, projects, props.onSelect]);

	useEffect(() => {
		if (!props.projectId) return;

		const foundProject = projects?.data?.findIndex(
			(e) => e.id === props.projectId,
		);
		if (foundProject && foundProject < 0) return;

		setSelectedProjectIdx(foundProject);
	}, [props.projectId, projects]);

	if (isLoading) return <Skeleton className="rounded-md w-full h-[36px]" />;

	return (
		<Select
			value={selectedProjectIdx !== undefined ? `${selectedProjectIdx}` : ""}
			disabled={props.disabled || isLoading}
			onValueChange={(e) => setSelectedProjectIdx(Number.parseInt(e))}
		>
			<SelectTrigger id={props.id ?? "project"} className="w-full h-[36px]">
				<SelectValue placeholder="Select a project" />
			</SelectTrigger>
			<SelectContent>
				{projects?.data?.map((e, i) => (
					<SelectItem key={e.id} value={`${i}`}>
						{e.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
