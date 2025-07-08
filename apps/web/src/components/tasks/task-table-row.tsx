import { MoreHorizontal } from "lucide-react";

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

import type { ProjectTask } from "@/lib/api";

interface TaskTableRowProps {
	task: ProjectTask;
}

export default function TaskTableRow({ task }: TaskTableRowProps) {
	return (
		<TableRow>
			<TableCell>{task.title}</TableCell>
			<TableCell>{task.description}</TableCell>
			<TableCell className="hidden md:table-cell">
				{new Date(task.createdAt as string).toString()}
			</TableCell>
			<TableCell className="w-[80px]">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => {}}>View Details</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => {}}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
