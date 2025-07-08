"use client";

import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";

import type { TimeEntry } from "@/lib/api";

import TimeEntryRow from "./time-entry-row";

interface TimeEntriesTableProps {
	timeEntries: TimeEntry[];
	onDelete?: (timeEntry: TimeEntry) => void;
}

export default function TimeEntriesTable({
	timeEntries,
	onDelete,
}: TimeEntriesTableProps) {
	return (
		<div className="border rounded-md">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[180px]">Title</TableHead>
						<TableHead>Project / Task</TableHead>
						<TableHead>Client</TableHead>
						<TableHead>Time</TableHead>
						<TableHead className="hidden md:table-cell">Duration</TableHead>
						<TableHead className="w-[80px]"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{timeEntries.map((entry) => (
						<TimeEntryRow
							onDelete={() => onDelete?.(entry)}
							key={`${entry.id}`}
							timeEntry={entry}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
