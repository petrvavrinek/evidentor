"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import { Calendar } from "@evidentor/ui/components/ui/calendar";
import { Label } from "@evidentor/ui/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@evidentor/ui/components/ui/popover";
import { Textarea } from "@evidentor/ui/components/ui/textarea";
import { TimeInput } from "@evidentor/ui/components/ui/time-input";

import type { Project, ProjectTask, TimeEntry } from "@/lib/api";
import { postTimeEntriesMutation } from "@/lib/api/@tanstack/react-query.gen";

import ProjectTaskSelect from "./project-task-select";

interface ManualTimeEntryProps {
	onCreate?: (newTimeEntry: TimeEntry) => void;
}

const defaultStart = new Date();
defaultStart.setHours(8);
defaultStart.setMinutes(0);
defaultStart.setSeconds(0);
defaultStart.setMilliseconds(0);

const defaultEnd = new Date(defaultStart);
defaultEnd.setHours(16);

export default function ManualTimeEntry(props: ManualTimeEntryProps) {
	const [title, setTitle] = useState("");
	const [selectedProject, setSelectedProject] = useState<Project | undefined>();
	const [selectedTask, setSelectedTask] = useState<ProjectTask | undefined>();

	const [startTime, setStartTime] = useState<Date | undefined>(defaultStart);
	const [endTime, setEndTime] = useState<Date | undefined>(defaultEnd);

	const today = new Date();
	today.setSeconds(0, 0); // Reset seconds and milliseconds

	const [date, setDate] = useState<Date>(today);

	const canAddTimeEntry = useMemo(() => title.length > 0, [title]);

	const createTimeEntry = useMutation({
		...postTimeEntriesMutation(),
		onSuccess: (data) => onCreate(data),
	});

	const onCreate = (newTimeEntry: TimeEntry) => {
		props.onCreate?.(newTimeEntry);
		setTitle("");

		setStartTime(undefined);
		setEndTime(undefined);
		setSelectedProject(undefined);
		setSelectedTask(undefined);
	};

	const handleCreate = () => {
		if(!startTime || !endTime) return;

		const startAt = new Date(date);
		startAt.setHours(startTime.getHours());
		startAt.setMinutes(startTime.getMinutes());
		startAt.setSeconds(startTime.getSeconds());

		const endAt = new Date(date);
		endAt.setHours(endTime.getHours());
		endAt.setMinutes(endTime.getMinutes());
		endAt.setSeconds(endTime.getSeconds());

		createTimeEntry.mutateAsync({
			body: {
				startAt,
				endAt,
				title,
				projectId: selectedProject?.id ?? null,
				projectTaskId: selectedTask?.id ?? null,
			},
		});
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="date">Date</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn("w-full justify-start text-left font-normal")}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, "PPP") : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							autoFocus
							onSelect={(e) => {
								if (e) setDate(e);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="startTime">Start Time</Label>
					<TimeInput date={startTime} setDate={setStartTime} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="endTime">End Time</Label>
					<TimeInput date={endTime} setDate={setEndTime} />
				</div>
			</div>

			<ProjectTaskSelect
				onProjectSelect={setSelectedProject}
				onTaskSelect={setSelectedTask}
			/>

			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Textarea
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					autoComplete="off"
					placeholder="Describe what you worked on"
				/>
			</div>

			<Button
				onClick={handleCreate}
				className="w-full"
				disabled={!canAddTimeEntry}
			>
				<Clock className="mr-2 h-4 w-4" />
				Add Time Entry
			</Button>
		</div>
	);
}
