"use client";

import type { TimeEntryDurationByDate } from "@/lib/api";
import { getDayNames, getMonthNames, isMonthSame } from "@/lib/dates";
import { groupBy } from "@/lib/utils";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@evidentor/ui/components/ui/chart";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface TimeEntryDurationChartProps {
	durations: TimeEntryDurationByDate;
	transformTitle?: (date: Date) => string;
	displayType: "day" | "month";
}
const dayNames = getDayNames("short");
const monthNames = getMonthNames("short");

const mapDayName = (e: Date) => dayNames[e.getDay()];
const mapMonthName = (e: Date) => monthNames[e.getMonth()];

export default function TimeEntryDurationChart({
	durations,
	displayType = "day",
}: TimeEntryDurationChartProps) {
	const reducedDurations = useMemo(() => {
		if (displayType === "day") return durations;

		const groupped = groupBy(durations, (e) => {
			const d = new Date(e.date as string);
			return `${d.getFullYear()}-${d.getMonth() + 1}-01 15:00:00.00`;
		});

		return Object.keys(groupped).map<TimeEntryDurationByDate[number]>(
			(yearMonth) => {
				const date = new Date(yearMonth);
				const filteredDurations = durations.filter((e) =>
					isMonthSame(e.date, date),
				);

				const totalDuration = filteredDurations.reduce(
					(prev, current) => prev + current.duration,
					0,
				);

				return {
					date,
					duration: totalDuration,
				};
			},
		);
	}, [displayType, durations]);

	const chartData = useMemo<TimeEntryDurationByDate>(() => {
		return reducedDurations.map((e) => ({
			date:
				displayType === "day"
					? mapDayName(new Date(e.date as never))
					: mapMonthName(new Date(e.date as never)),
			duration: Math.floor(e.duration / 60 / 60),
		}));
	}, [reducedDurations, displayType]);

	const chartConfig = {
		duration: {
			label: "Duration",
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer config={chartConfig}>
			<BarChart accessibilityLayer data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="date"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar dataKey="duration" fill="var(--chart-1)" radius={8} />
			</BarChart>
		</ChartContainer>
	);
}
