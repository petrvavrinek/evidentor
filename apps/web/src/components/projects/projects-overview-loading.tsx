import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@evidentor/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@evidentor/ui/components/ui/table";

export default function ProjectsOverviewLoading() {
	return (
		<Card className="my-8 animate-pulse">
			<CardHeader className="px-6">
				<CardTitle>Project List</CardTitle>
			</CardHeader>
			<CardContent className="px-6">
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Project</TableHead>
								<TableHead>Client</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="hidden md:table-cell">Priority</TableHead>
								<TableHead className="hidden lg:table-cell">Deadline</TableHead>
								<TableHead className="hidden lg:table-cell">Progress</TableHead>
								<TableHead className="w-[80px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...Array(5)].map((_, i) => (
								<TableRow key={i}>
									{[...Array(7)].map((_, j) => (
										<TableCell key={j}>
											<div className="h-4 bg-gray-100 rounded w-full" />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
