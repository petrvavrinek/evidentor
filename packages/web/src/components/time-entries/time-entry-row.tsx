import { Project } from "@/schemas/project.schema";
import { Task } from "@/schemas/task.schema";
import { Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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

interface TimeEntryRowProps {
  project: Project;
  task: Task;
}

export default function TimeEntryRow({ project, task }: TimeEntryRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{project.title}</div>
        <div className="text-sm text-muted-foreground">{task.title}</div>
      </TableCell>
      <TableCell>Client name</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          <span>1:00 - 2:00</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="font-medium">1h</span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="max-w-[300px] truncate text-sm">
          <span className="text-muted-foreground">No notes</span>
        </div>
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
            <DropdownMenuItem onClick={() => {}}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {}}
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
