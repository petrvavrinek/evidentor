"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";

import type { Project, ProjectTask, TimeEntry } from "@/lib/api";
import { postTimeEntryMutation } from "@/lib/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { type Time, TimeInput } from "../time-input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import ProjectTaskSelect from "./project-task-select";

interface ManualTimeEntryProps {
	onCreate?: (newTimeEntry: TimeEntry) => void;
}

export default function ManualTimeEntry(props: ManualTimeEntryProps) {
	const [title, setTitle] = useState("");
	const [selectedProject, setSelectedProject] = useState<Project | undefined>();
	const [selectedTask, setSelectedTask] = useState<ProjectTask | undefined>();

	const [startTime, setStartTime] = useState<Time>({ hours: 8, minutes: 0 });
	const [endTime, setEndTime] = useState<Time>({ hours: 16, minutes: 0 });

	const today = new Date();
	today.setSeconds(0, 0); // Reset seconds and milliseconds

	const [date, setDate] = useState<Date>(today);

	const canAddTimeEntry = useMemo(() => title.length > 0, [title]);

	const createTimeEntry = useMutation({
		...postTimeEntryMutation(),
		onSuccess: (data) => onCreate(data),
	});

	const onCreate = (newTimeEntry: TimeEntry) => {
		props.onCreate?.(newTimeEntry);
		setTitle("");
		setStartTime({ hours: 8, minutes: 0 });
		setEndTime({ hours: 16, minutes: 0 });
		setSelectedProject(undefined);
		setSelectedTask(undefined);
	};

	const handleCreate = () => {
		const startAt = new Date(date);
		startAt.setHours(startTime.hours);
		startAt.setMinutes(startTime.minutes);

		const endAt = new Date(date);
		endAt.setHours(endTime.hours);
		endAt.setMinutes(endTime.minutes);

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
							initialFocus
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
					<TimeInput value={startTime} onChange={setStartTime} />
				</div>
				<div className="space-y-2">
					<Label htmlFor="endTime">End Time</Label>
					<TimeInput value={endTime} onChange={setEndTime} />
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
