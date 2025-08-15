import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { getProjectTasks, type Project } from "@/lib/api";
import { getProjectTasksQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import { Dialog, DialogContent } from "@evidentor/ui/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@evidentor/ui/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@evidentor/ui/components/ui/tabs";
import { TypographyH2 } from "@evidentor/ui/components/ui/typography";

interface ProjectDetailModalProps {
	project?: Project;
	isOpen?: boolean;
	onClose?: () => void;
}

export default function ProjectDetailModal({
	project,
	isOpen,
	onClose,
}: ProjectDetailModalProps) {
	const tasksQuery = useQuery({
		queryKey: getProjectTasksQueryKey({ query: { project: project?.id } }),
		initialData: [],
		queryFn: async () => {
			if (!project?.id) return [];
			const tasks = await getProjectTasks({ query: { project: project.id } });
			return tasks.data ?? [];
		},
		enabled: false,
	});

	const [activeTab, setActiveTab] = useState<string>();

	// Fetch
	useEffect(() => {
		console.log(activeTab);
		if (activeTab === "tasks") tasksQuery.refetch();
	}, [activeTab, tasksQuery]);

	// Nothing to render
	if (!project) return;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<Tabs
					className="w-full"
					defaultValue="overview"
					value={activeTab}
					onValueChange={setActiveTab}
				>
					<TabsList className="grid grid-cols-4 w-full">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="tasks">Tasks</TabsTrigger>
					</TabsList>

					<TabsContent value="overview">
						<Card>
							<CardHeader>
								<CardTitle>Project details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<TypographyH2>Description</TypographyH2>
									<p>{project.title} -- desc</p>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<h3 className="text-sm font-medium text-muted-foreground mb-1">
											Start Date
										</h3>
										<div className="flex items-center">
											<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
											{project.createdAt as string}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="tasks">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Project assigned tasks</CardTitle>
									<CardDescription>Manage project tasks</CardDescription>
								</div>
								<Button size="sm">
									<Plus className="h-4 w-4 mr-1" />
									Add Task
								</Button>
							</CardHeader>
							<CardContent>
								{tasksQuery.data.length === 0 ? (
									<div className="text-center py-6 text-muted-foreground">
										No tasks found for this project.
									</div>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[300px]">Task</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Hours Logged</TableHead>
												<TableHead className="text-right">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{tasksQuery.data.map((task) => (
												<TableRow key={task.id}>
													<TableCell className="font-medium">
														{task.title}
													</TableCell>
													<TableCell>STAT</TableCell>
													<TableCell>OURS hrs</TableCell>
													<TableCell className="text-right">
														<Button variant="ghost" size="sm">
															Edit
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
