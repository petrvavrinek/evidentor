"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Loader } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/page-header";
import TimeEntriesTable from "@/components/time-entries/time-entries-table";
import ManualTimeEntry from "@/components/time-tracker/manual-time-entry";
import Stopwatch from "@/components/time-tracker/stopwatch";
import { getTimeEntries, type TimeEntry } from "@/lib/api";
import {
	deleteTimeEntriesByIdMutation,
	getProjectTasksQueryKey,
} from "@/lib/api/@tanstack/react-query.gen";
import { groupBy } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@evidentor/ui/components/ui/tabs";
import { TypographyH3 } from "@evidentor/ui/components/ui/typography";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useTranslations } from "next-intl";
import useTitle from "@/hooks/use-title";

// TODO: Rework

export default function TimeTrackerPage() {
	const t = useTranslations("app.pages.timeTracker");
	const [currentTab, setCurrentTab] = useState("stopwatch");
	const dateFormatter = useDateFormatter();
	const [createdTimeEntries, setCreatedTimeEntries] = useState<TimeEntry[]>([]);
	const [fetchedTimeEntreis, setFetchedTimeEntries] = useState<TimeEntry[]>([]);

	useTitle(t("title"));

	const { data: projectTasks, isLoading } = useQuery({
		queryKey: getProjectTasksQueryKey(),
		queryFn: () => getTimeEntries(),
	});

	const deleteTimeEntry = useMutation({
		...deleteTimeEntriesByIdMutation(),
	});

	const onCreateTimeEntry = (timeEntry: TimeEntry) => {
		setCreatedTimeEntries([timeEntry, ...createdTimeEntries]);
	};

	const getDateKey = (date: Date) => {
		const n = new Date(date);
		n.setMilliseconds(0);
		n.setHours(0);
		n.setSeconds(0);
		n.setMinutes(0);
		return n.toISOString();
	};

	useEffect(() => {
		setFetchedTimeEntries(projectTasks ?? []);
	}, [projectTasks]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: getDateKey is static
	const grouppedTimeEntries = useMemo(() => {
		const allTimeEntries = [...createdTimeEntries, ...(projectTasks ?? [])];
		return groupBy(allTimeEntries, (e) =>
			getDateKey(new Date(e.startAt as string)),
		);
	}, [createdTimeEntries, fetchedTimeEntreis]);

	const getGrouppedTimeEntriesSorted = () => {
		const keys = Object.keys(grouppedTimeEntries);
		return keys.toSorted(
			(a, b) => new Date(b).getTime() - new Date(a).getTime(),
		);
	};

	const onTimeEntryDelete = async (timeEntry: TimeEntry) => {
		// delete and re-render
		await deleteTimeEntry.mutateAsync({
			path: { id: timeEntry.id },
		});

		setCreatedTimeEntries(
			createdTimeEntries.filter((e) => e.id !== timeEntry.id),
		);
		setFetchedTimeEntries(
			fetchedTimeEntreis.filter((e) => e.id !== timeEntry.id),
		);
	};

	return (
		<>
			<PageHeader
				title={t("title")}
				subtitle={t("description")}
			/>
			<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
				<Card className="xl:col-span-1 h-fit">
					<CardContent>
						<Tabs
							value={currentTab}
							searchParam="tab"
							onValueChange={(e) => setCurrentTab(e)}
						>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="stopwatch">
									<Clock className="h-4 w-4 mr-2" />
									{t("stopwatch")}
								</TabsTrigger>
								<TabsTrigger value="manual">
									<Calendar className="h-4 w-4 mr-2" />
									{t("manualEntry")}
								</TabsTrigger>
							</TabsList>
							<TabsContent value="stopwatch" className="mt-4">
								<Stopwatch onStop={onCreateTimeEntry} />
							</TabsContent>
							<TabsContent value="manual" className="mt-4">
								<ManualTimeEntry onCreate={onCreateTimeEntry} />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				<Card className="xl:col-span-2">
					<CardHeader>
						<CardTitle>Recent Time Entries</CardTitle>
						<CardDescription>Your recent tracked time</CardDescription>
					</CardHeader>
					<CardContent>
						{(!projectTasks || isLoading) && <Loader />}

						{getGrouppedTimeEntriesSorted().map((d) => (
							<div key={d} className="space-y-2 py-2">
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4 text-muted-foreground" />
									<TypographyH3 className="text-sm font-medium">
										{dateFormatter.format(new Date(d))}
									</TypographyH3>
								</div>

								<TimeEntriesTable
									timeEntries={grouppedTimeEntries[d]}
									onDelete={onTimeEntryDelete}
								/>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
