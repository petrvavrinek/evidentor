"use client";

import { getProjectTask, Project, ProjectTask } from "@/lib/api";
import { getProjectTaskQueryKey } from "@/lib/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

interface TaskSelectProps {
	/**
	 * What projects to load tasks from
	 */
	project?: Project;
	/**
	 * Called on task selected
	 * @param task Task
	 * @returns
	 */
	onSelect?: (task: ProjectTask) => void;
	/**
	 * Should be select disabled?
	 */
	disabled?: boolean;
	/**
	 * Select ID for Label usage
	 */
	id?: string;
}

/**
 * Components that allows dynamically load tasks
 * @param props Component props
 * @returns
 */
export default function TaskSelect(props: TaskSelectProps) {
	const { data: tasks, isLoading } = useQuery({
		queryKey: getProjectTaskQueryKey({ query: { project: props.project?.id}}),
		queryFn: () => getProjectTask({ query: { project: props.project?.id }}),
	});

	const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | undefined>(
		undefined,
	);

	useEffect(() => {
		if (selectedTaskIdx !== undefined && tasks?.data)
			props.onSelect?.(tasks.data[selectedTaskIdx]);
	}, [selectedTaskIdx, tasks, props]);

	// useEffect(() => {
	//   setSelectedTaskIdx(undefined);
	// }, [data]);

	if (isLoading || !tasks?.data)
		return <Skeleton className="rounded-md w-full h-[36px]" />;

	return (
		<Select
			value={selectedTaskIdx !== undefined ? `${selectedTaskIdx}` : ""}
			disabled={props.disabled || isLoading}
			onValueChange={(e) => setSelectedTaskIdx(Number.parseInt(e))}
		>
			<SelectTrigger id={props.id ?? "task"} className="w-full h-[36px]">
				<SelectValue placeholder="Select a task" />
			</SelectTrigger>
			<SelectContent>
				{tasks.data.map((e, i) => (
					<SelectItem key={e.id} value={`${i}`}>
						{e.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
