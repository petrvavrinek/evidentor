import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

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

import type { Project } from "@/lib/api/types.gen";

interface ProjectTableRowProps {
	project: Project;
	onUpdate?: (id: number) => void;
	onDelete?: (id: number) => void;
	onDetailShow?: () => void;
}

export default function ProjectTableRow({
	project,
	onUpdate,
	onDelete,
	onDetailShow,
}: ProjectTableRowProps) {
	return (
		<TableRow>
			<TableCell>
				<Link
					href={`/app/projects/${project.id}`}
					className="text-blue-600 hover:underline"
					prefetch={false}
				>
					{project.title || "Untitled Project"}
				</Link>
			</TableCell>
			<TableCell>{project.client?.companyName || "-"}</TableCell>
			<TableCell>-</TableCell> {/* Status placeholder */}
			<TableCell className="hidden md:table-cell">-</TableCell>{" "}
			{/* Priority placeholder */}
			<TableCell className="hidden lg:table-cell">-</TableCell>{" "}
			{/* Deadline placeholder */}
			<TableCell className="hidden lg:table-cell">-</TableCell>{" "}
			{/* Progress placeholder */}
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={onDetailShow}>Detail</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onUpdate?.(project.id)}>
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => onDelete?.(project.id)}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
