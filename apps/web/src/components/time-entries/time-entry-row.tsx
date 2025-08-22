"use client";

import { Clock, Link, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@evidentor/ui/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@evidentor/ui/components/ui/table";

import type { TimeEntry } from "@/lib/api";
import { formatTime } from "@/lib/format-time";
import { useRouter } from "next/navigation";

interface TimeEntryRowProps {
	timeEntry: TimeEntry;
	onDelete?: () => void;
}

export default function TimeEntryRow({
	timeEntry,
	onDelete,
}: TimeEntryRowProps) {
	const router = useRouter();
	const formatDateTime = (date: Date) => {
		const h = date.getHours().toString().padStart(2, "0");
		const m = date.getMinutes().toString().padStart(2, "0");
		return `${h}:${m}`;
	};

	const getDuration = () => {
		const start = new Date(timeEntry.startAt as string);
		const end = new Date(timeEntry.endAt as string);
		return end.getTime() - start.getTime();
	};

	return (
		<TableRow>
			<TableCell>{timeEntry.title ?? "-"}</TableCell>
			<TableCell>
				<div className="font-medium">{timeEntry.project?.title ?? "-"}</div>
				<div className="text-sm text-muted-foreground">
					{timeEntry.projectTask?.title ?? "-"}
				</div>
			</TableCell>
			<TableCell>{timeEntry.project?.client?.companyName ?? "-"}</TableCell>
			<TableCell>
				<div className="flex items-center">
					<Clock className="h-3 w-3 mr-1 text-muted-foreground" />
					<span>
						{formatDateTime(new Date(timeEntry.startAt as string))} -{" "}
						{formatDateTime(new Date(timeEntry.endAt as string))}
					</span>
				</div>
			</TableCell>
			<TableCell className="hidden md:table-cell">
				<span className="font-medium">{formatTime(getDuration())}</span>
			</TableCell>
			<TableCell className="md:table-cell">
				{
					timeEntry.invoiceId && (
						<Button className="w-fit h-fit rounded-xl" onClick={() => {
							router.push(`/app/invoices/detail/${timeEntry.invoiceId}`)
						}}>
							<Link size={16} className="p-0" />
						</Button>
					)
				}
			</TableCell>
			<TableCell className="md:table-cell">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => { }}>
							<Pencil className="h-4 w-4 mr-2" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={onDelete}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
