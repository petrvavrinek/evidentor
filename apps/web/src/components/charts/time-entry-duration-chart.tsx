"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@evidentor/ui/components/ui/chart";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { TimeEntryDurationByDate } from "@/lib/api";

interface TimeEntryDurationChartProps {
	durations: TimeEntryDurationByDate;
	transformTitle?: (date: Date) => string;
}

export default function TimeEntryDurationChart({
	durations,
	transformTitle,
}: TimeEntryDurationChartProps) {
	const chartData = useMemo<TimeEntryDurationByDate>(() => {
		return durations.map((e) => ({
			date: transformTitle?.(new Date(e.date as string)) ?? (e.date as string),
			duration: Math.floor(e.duration / 60 / 60),
		}));
	}, [durations, transformTitle]);

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
