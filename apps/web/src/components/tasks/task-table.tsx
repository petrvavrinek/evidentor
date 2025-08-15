import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";

import type { ProjectTask } from "@/lib/api";

import TaskTableRow from "./task-table-row";

interface TaskTableProps {
  tasks: ProjectTask[];
  onTaskUpdate?: (task: ProjectTask) => void;
}

export default function TaskTable({ tasks, onTaskUpdate }: TaskTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead className="hidden md:table-cell">Created At</TableHead>
						<TableHead className="w-[80px]"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
          {tasks.map((e) => (
            <TaskTableRow key={e.id} task={e} onTaskUpdateShow={onTaskUpdate} />
          ))}
				</TableBody>
			</Table>
		</div>
	);
}
