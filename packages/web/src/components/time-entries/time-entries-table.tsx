import { Project } from "@/schemas/project.schema";
import { Task } from "@/schemas/task.schema";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import TimeEntryRow from "./time-entry-row";

interface TimeEntry {
  project: Project;
  task: Task;
}

interface TimeEntriesTableProps {
  timeEntries: TimeEntry[];
}

export default function TimeEntriesTable({
  timeEntries,
}: TimeEntriesTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Project / Task</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="hidden md:table-cell">Notes</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.map((entry) => (
            <TimeEntryRow
              key={`${entry.project.id}_${entry.task.id}`}
              project={entry.project}
              task={entry.task}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
