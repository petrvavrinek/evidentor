"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
	getTimeEntryAnalyzeDurationByDate,
	type TimeEntryDurationByDate,
} from "@/lib/api";
import { getTimeEntryAnalyzeDurationByDateQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import {
	createDatesBetween,
	firstDayOfWeek,
	isDateSame,
	toDateOnly,
} from "@/lib/dates";

import TimeEntryDurationChart from "../charts/time-entry-duration-chart";
import DashboardCard from "./dashboard-card";

const firstDayDate = toDateOnly(firstDayOfWeek(new Date(), 1));
const lastDayDate = toDateOnly(firstDayDate);
lastDayDate.setDate(firstDayDate.getDate() + 7);
lastDayDate.setHours(firstDayDate.getHours() - 1);

export default function HoursSummaryCard() {
	const dates = createDatesBetween(firstDayDate, lastDayDate);

	const { data, isLoading } = useQuery({
		queryKey: getTimeEntryAnalyzeDurationByDateQueryKey(),
		queryFn: () =>
			getTimeEntryAnalyzeDurationByDate({
				query: { from: firstDayDate, to: lastDayDate },
			}),
	});

	const transformedDates = useMemo<TimeEntryDurationByDate>(() => {
		return dates.map((e) => {
			const d = data?.data ?? [];
			const sameDate = d.find((d) => isDateSame(new Date(d.date as string), e));

			return {
				date: e,
				duration: sameDate?.duration ?? 0,
			};
		});
	}, [data?.data, dates]);

	return (
		<DashboardCard title="Hours summary" subtitle="Your working hours overview">
			{data?.data && (
				<TimeEntryDurationChart durations={transformedDates} displayType="day" />
			)}
			{isLoading && "..."}
		</DashboardCard>
	);
}
