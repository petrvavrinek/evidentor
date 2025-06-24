import { MoreHorizontal } from "lucide-react";
import { Project } from "@/lib/api";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TableCell, TableRow } from "../ui/table";

interface ProjectTableRowProps {
	project: Project;
}

export default function ProjectTableRow({ project }: ProjectTableRowProps) {
	return (
		<TableRow>
			<TableCell>
				<div className="font-medium">{project.title}</div>
				<div className="text-sm text-muted-foreground truncate max-w-[250px]">
					Description
				</div>
			</TableCell>
			<TableCell className="hidden md:table-cell">
				{project.client?.companyName ?? project.client?.contactName}
			</TableCell>
			<TableCell className="hidden md:table-cell">Status</TableCell>
			<TableCell className="hidden md:table-cell">Priority</TableCell>
			<TableCell className="hidden lg:table-cell">Deadline</TableCell>
			<TableCell className="hidden lg:table-cell">Progress</TableCell>
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
						<DropdownMenuItem>View Details</DropdownMenuItem>
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive focus:text-destructive">
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
