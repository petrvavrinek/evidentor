"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@evidentor/ui/components/ui/select";
import { Skeleton } from "@evidentor/ui/components/ui/skeleton";

import { getProjectTasks, Project, ProjectTask } from "@/lib/api";
import { getProjectTasksQueryKey } from "@/lib/api/@tanstack/react-query.gen";

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

	/**
	 * Selected task ID
	 */
	taskId?: ProjectTask["id"];
}

/**
 * Components that allows dynamically load tasks
 * @param props Component props
 * @returns
 */
export default function TaskSelect(props: TaskSelectProps) {
	const { data: tasks, isLoading } = useQuery({
		queryKey: getProjectTasksQueryKey({ query: { project: props.project?.id } }),
		queryFn: () => getProjectTasks({ query: { project: props.project?.id } }),
	});

	const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | undefined>(
		undefined,
	);

	useEffect(() => {
		if (selectedTaskIdx !== undefined && tasks)
			props.onSelect?.(tasks[selectedTaskIdx]);
	}, [selectedTaskIdx, tasks, props]);

	useEffect(() => {
		if (!props.taskId) return;

		const selectedTaskIdx = tasks?.findIndex(
			(e) => e.id === props.taskId,
		);
		if (selectedTaskIdx && selectedTaskIdx < 0) return;

		setSelectedTaskIdx(selectedTaskIdx);
	}, [props.taskId, tasks]);

	if (isLoading || !tasks)
		return <Skeleton className="rounded-md w-full h-[36px]" />;

	return (
		<Select
			value={selectedTaskIdx !== undefined ? `${selectedTaskIdx}` : ""}
			disabled={props.disabled || isLoading || tasks.length === 0}
			onValueChange={(e) => setSelectedTaskIdx(Number.parseInt(e))}
		>
			<SelectTrigger id={props.id ?? "task"} className="w-full h-[36px]">
				<SelectValue
					placeholder={
						(!isLoading && !tasks.length)
							? "No project tasks"
							: "Select a task"
					}
				/>
			</SelectTrigger>
			<SelectContent>
				{tasks.map((e, i) => (
					<SelectItem key={e.id} value={`${i}`}>
						{e.title}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
