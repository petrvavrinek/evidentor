import type { ProjectTask } from "@/lib/api";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import TaskTableRow from "./task-table-row";

interface TaskTableProps {
	tasks: ProjectTask[];
}

export default function TaskTable({ tasks }: TaskTableProps) {
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
						<TaskTableRow key={e.id} task={e} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}
