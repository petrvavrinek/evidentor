"use client";

import { useState } from "react";

import { Label } from "@evidentor/ui/components/ui/label";

import type { Project, ProjectTask } from "@/lib/api";

import { ProjectSelect } from "../project-select";
import TaskSelect from "../task-select";

interface ProjectTaskSelectProps {
	projectId?: Project["id"];
	taskId?: ProjectTask["id"];
	onProjectSelect?: (project: Project) => void;
	onTaskSelect?: (task: ProjectTask) => void;
	disabled?: boolean;
}

export default function ProjectTaskSelect(props: ProjectTaskSelectProps) {
	const [selectedProject, setSelectedProject] = useState<Project | undefined>();

	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="project">Project</Label>
				<ProjectSelect
					disabled={props.disabled}
					onSelect={(project) => {
						props.onProjectSelect?.(project);
						setSelectedProject(project);
					}}
					projectId={props.projectId}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="task">Task</Label>
				<TaskSelect
					project={selectedProject}
					disabled={props.disabled || !selectedProject}
					key={selectedProject?.id}
					onSelect={(task) => {
						props.onTaskSelect?.(task);
					}}
					taskId={props.taskId}
				/>
			</div>
		</>
	);
}
