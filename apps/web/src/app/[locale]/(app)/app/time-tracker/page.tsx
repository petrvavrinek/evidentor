"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowDown, Calendar, Clock, DollarSign, Link } from "lucide-react";
import { useState } from "react";

import PageHeader from "@/components/page-header";
import QueryDataTable, { QueryDataTableMeta } from "@/components/query-data-table";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import ManualTimeEntry from "@/components/time-tracker/manual-time-entry";
import Stopwatch from "@/components/time-tracker/stopwatch";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import useTitle from "@/hooks/use-title";
import { getTimeEntries, type TimeEntry } from "@/lib/api";
import {
	deleteTimeEntriesByIdMutation,
	getTimeEntriesQueryKey
} from "@/lib/api/@tanstack/react-query.gen";
import { isDateSame } from "@/lib/dates";
import { formatTime } from "@/lib/format-time";
import { Button } from "@evidentor/ui/components/ui/button";
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
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

// TODO: Rework

export default function TimeTrackerPage() {
	const router = useRouter();
	const t = useTranslations("app.pages.timeTracker");
	const [currentTab, setCurrentTab] = useState("stopwatch");

	useTitle(t("title"));

	const deleteTimeEntryMutation = useMutation(deleteTimeEntriesByIdMutation());

	const onCreateTimeEntry = (timeEntry: TimeEntry) => {

	};

	const formatDuration = (timeEntry: TimeEntry): string => {
		const start = new Date(timeEntry.startAt as string);
		const end = new Date(timeEntry.endAt as string);

		return formatTime(end.getTime() - start.getTime());
	}
	const dateFormatter = useDateFormatter({ day: "numeric", month: "2-digit", year: "numeric" });

	const columns: ColumnDef<TimeEntry>[] = [
		{
			accessorKey: "title",
			header: "Title"
		},
		{
			id: "project-task",
			cell: ({ row: { original: item } }) => (
				<>
					<div className="font-medium">{item.project?.title ?? "-"}</div>
					<div className="text-sm text-muted-foreground">
						{item.projectTask?.title ?? "-"}
					</div>
				</>
			),
			header: "Project / Task"
		},
		{
			accessorKey: "project.client.companyName",
			header: "Client"
		},
		{
			id: "duration",
			cell: ({ row }) => formatDuration(row.original),
			header: "Duration"
		},
		{
			id: "date",
			cell: ({ row: { original: item } }) => {
				const start = new Date(item.startAt as string);
				const end = new Date(item.endAt as string);
				const isSame = isDateSame(start, end);
				if (isSame) return dateFormatter.format(start);

				return (
					<div className="flex flex-col w-fit items-center">
						<div>{dateFormatter.format(start)}</div>
						<div>
							<ArrowDown size={14} />
						</div>
						<div>{dateFormatter.format(end)}</div>
					</div>
				)
			},
			header: "Date"
		},
		{
			id: "invoice",
			cell: ({ row: { original: item } }) => (
				item.invoiceId ? (
					<Button onClick={() => router.push(`/app/invoices/details/${item.invoiceId}`)}>
						<Link size={16} className="p-0" />
					</Button>
				) : undefined
			),
			header: () => <DollarSign size={16} />
		},
		{
			id: "options",
			cell: ({ row: { original: item }, table }) => (
				<TableItemDetailMenu
					onDelete={async () => {
						const meta = table.options.meta as QueryDataTableMeta<TimeEntry>;
						await deleteTimeEntryMutation.mutateAsync({ path: { id: item.id } });
						meta.removeRow(item);
					}}
				/>
			)

		}
	]

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
						<QueryDataTable
							columns={columns}
							queryFn={getTimeEntries}
							queryKey={getTimeEntriesQueryKey()}
							pagination={{ pageSize: 20 }}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
