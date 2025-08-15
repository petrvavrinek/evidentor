"use client";

import { useMutation } from "@tanstack/react-query";
import { Play, StopCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent } from "@evidentor/ui/components/ui/card";
import { Label } from "@evidentor/ui/components/ui/label";
import { Textarea } from "@evidentor/ui/components/ui/textarea";

import useActiveTimeEntry from "@/hooks/use-active-time-entry";
import type { Project, ProjectTask, TimeEntry } from "@/lib/api";
import {
	patchTimeEntriesByIdMutation,
	postTimeEntriesMutation,
} from "@/lib/api/@tanstack/react-query.gen";
import { formatTime } from "@/lib/format-time";

import ProjectTaskSelect from "./project-task-select";

interface StopwatchProps {
	onStop?: (timeEntry: TimeEntry) => void;
}

export default function Stopwatch({ onStop }: StopwatchProps) {
	const { active: activeTimeEntry, setActive: setActiveTimeEntry } =
		useActiveTimeEntry();

	const [timeMs, setTimeMs] = useState(0);
	const [title, setTitle] = useState<string>("");
	const [selectedProject, setSelectedProject] = useState<Project | undefined>();
	const [selectedTask, setSelectedTask] = useState<ProjectTask | undefined>();

	const canStartTimer = useMemo(() => title.length > 0, [title]);

	const createTimeEntry = useMutation({
		...postTimeEntriesMutation(),
		onSuccess: (data) => {
			setActiveTimeEntry(data);
		},
	});

	const updateTimeEntry = useMutation({
		...patchTimeEntriesByIdMutation(),
	});

	useEffect(() => {
		if (!activeTimeEntry) return;

		setTitle(activeTimeEntry.title ?? "");
		setSelectedProject(activeTimeEntry.project ?? undefined);

		// TODO: Proper types
		setSelectedTask({
			...activeTimeEntry.projectTask,
			project: activeTimeEntry.project,
		} as never);
	}, [activeTimeEntry]);

	useEffect(() => {
		if (!activeTimeEntry) return;

		const getTimeEntryTime = () => {
			if (!activeTimeEntry) return 0;

			const now = Date.now();
			const startedAt = new Date(activeTimeEntry.startAt as string);
			return now - startedAt.getTime();
		};

		setTimeMs(getTimeEntryTime());

		const ref = setInterval(() => {
			setTimeMs(getTimeEntryTime());
		}, 1000);

		return () => clearInterval(ref);
	}, [activeTimeEntry]);

	const handleStart = () => {
		createTimeEntry.mutateAsync({
			body: {
				title: title,
				projectId: selectedProject?.id ?? null,
				startAt: new Date(),
				projectTaskId: selectedTask?.id,
				endAt: null,
			},
		});
	};

	const handleStop = () => {
		if (!activeTimeEntry) return;

		updateTimeEntry
			.mutateAsync({
				body: {
					endAt: new Date(),
				},
				path: {
					id: activeTimeEntry.id,
				},
			})
			.then((e) => {
				setTitle("");
				setSelectedProject(undefined);
				setSelectedTask(undefined);
				setTimeMs(0);

				setActiveTimeEntry(null);
				onStop?.(e);
			});
	};

	return (
		<div className="space-y-4">
			<ProjectTaskSelect
				disabled={!!activeTimeEntry}
				onProjectSelect={setSelectedProject}
				onTaskSelect={setSelectedTask}
				projectId={selectedProject?.id}
				taskId={selectedTask?.id}
			/>

			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Textarea
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					id="title"
					autoComplete="off"
					placeholder="What are you working on?"
				/>
			</div>

			<Card className="bg-muted/50 border-0">
				<CardContent className="p-6 flex flex-col items-center justify-center">
					<div className="text-4xl font-mono font-bold mb-4">
						{formatTime(timeMs)}
					</div>
					<div className="flex gap-2">
						{!activeTimeEntry && (
							<Button
								onClick={handleStart}
								disabled={!canStartTimer}
								className="w-full"
							>
								<Play className="h-4 w-4 mr-2" />
								Start Work
							</Button>
						)}
						{!!activeTimeEntry && (
							<Button onClick={handleStop} variant="destructive">
								<StopCircle className="h-4 w-4 mr-2" />
								End Work
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
