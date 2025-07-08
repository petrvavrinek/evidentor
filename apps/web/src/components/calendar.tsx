"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";

import { getDayNames, getMonthNames } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Event } from "@/schemas/event.schema";

interface CalendarProps {
	date: Date;
	onDateSelect: (date: Date) => void;
	onMonthViewChange?: (startDate: Date, endDate: Date) => void;
	events?: Event[];
}

export default function Calendar({
	date,
	onDateSelect,
	onMonthViewChange,
	events,
}: CalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(date.getMonth());
	const [currentYear, setCurrentYear] = useState(date.getFullYear());
	const monthNames = getMonthNames("long");
	const dayNames = getDayNames("short");

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	};

	const getFirstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 1).getDay();
	};

	const isToday = (day: number) => {
		const today = new Date();
		return (
			day === today.getDate() &&
			currentMonth === today.getMonth() &&
			currentYear === today.getFullYear()
		);
	};

	const isSelected = (day: number) => {
		return (
			day === date.getDate() &&
			currentMonth === date.getMonth() &&
			currentYear === date.getFullYear()
		);
	};

	const getEventsForDate = (day: number) => {
		if (!events) return [];

		const date = new Date(currentYear, currentMonth, day);
		return events.filter(
			(event) => event.dateFrom.toDateString() === date.toDateString(),
		);
	};

	const getEventDisplayInfo = (event: Event, day: number) => {
		const eventStart = new Date(event.dateFrom);
		const eventEnd = event.dateTo
			? new Date(event.dateTo)
			: new Date(event.dateFrom);
		const currentDate = new Date(currentYear, currentMonth, day);

		const isStartDay = eventStart.toDateString() === currentDate.toDateString();
		const isEndDay = eventEnd.toDateString() === currentDate.toDateString();
		const isMiddleDay = !isStartDay && !isEndDay;
		const isSingleDay = eventStart.toDateString() === eventEnd.toDateString();

		return {
			isStartDay,
			isEndDay,
			isMiddleDay,
			isSingleDay,
			showTime: isStartDay || isSingleDay,
		};
	};

	const daysInMonth = getDaysInMonth(currentYear, currentMonth);
	const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
	};

	useEffect(() => {
		const start = new Date(
			currentYear,
			currentMonth - 1,
			firstDayOfMonth + 1,
			0,
			0,
			0,
			0,
		);
		const end = new Date(
			start.getFullYear(),
			start.getMonth() + 1,
			start.getDate() - 1,
			23,
			59,
			59,
			9999,
		);

		onMonthViewChange?.(start, end);
	}, [currentMonth, currentYear, onMonthViewChange, firstDayOfMonth]);

	const handleDateClick = (day: number) => {
		const newDate = new Date(currentYear, currentMonth, day);
		onDateSelect(newDate);
	};

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold">
					{monthNames[currentMonth]} {currentYear}
				</h2>
				<div className="flex items-center space-x-2">
					<Button variant="outline" size="sm" onClick={handlePrevMonth}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="sm" onClick={handleNextMonth}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-1 mb-2">
				{dayNames.map((day) => (
					<div
						key={day}
						className="p-2 text-center text-sm font-medium text-muted-foreground"
					>
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1">
				{Array.from({ length: firstDayOfMonth }).map((_, index) => (
					<div key={`empty-${index}`} className="h-20 md:h-24"></div>
				))}

				{Array.from({ length: daysInMonth }).map((_, index) => {
					const day = index + 1;
					const dayEvents = getEventsForDate(day);

					return (
						// biome-ignore lint/a11y/useButtonType: TODO
						<button
							key={day}
							className={cn(
								"h-30 md:h-30 p-1 border rounded-lg hover:bg-muted/50 transition-colors flex flex-col !outline-none !focus:outline-0",
								isToday(day) && "bg-primary/10 border-primary",
								isSelected(day) && "bg-primary/30 border-primary",
								"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
							)}
							onClick={() => handleDateClick(day)}
						>
							<span
								className={cn(
									"text-sm font-medium mb-1",
									isToday(day) && "text-primary font-bold",
								)}
							>
								{day}
							</span>

							<div className="flex-1 overflow-hidden">
								{dayEvents.slice(0, 2).map((event) => {
									const displayInfo = getEventDisplayInfo(event, day);
									return (
										<div
											key={event.id}
											className={cn(
												"text-xs p-1 mb-1 rounded truncate cursor-pointer",
												"text-white",
												displayInfo.isSingleDay
													? "bg-blue-500"
													: displayInfo.isStartDay
														? "bg-blue-500 rounded-r-none"
														: displayInfo.isEndDay
															? "bg-blue-400 rounded-l-none"
															: displayInfo.isMiddleDay
																? "bg-blue-300 rounded-none"
																: "bg-blue-500",
											)}
											title={
												event.title + (event.note ? ` - ${event.note}` : "")
											}
										>
											{event.title}
										</div>
									);
								})}
								{dayEvents.length > 3 && (
									<div className="text-xs text-muted-foreground">
										+{dayEvents.length - 3} more
									</div>
								)}
							</div>
						</button>
					);
				})}
			</div>
		</>
	);
}
