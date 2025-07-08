"use client";

import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";

import Calendar from "@/components/calendar";
import EventRow from "@/components/calendar/event-row";
import PageHeader from "@/components/page-header";

import { Button } from "@evidentor/ui/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@evidentor/ui/components/ui/dialog";

import type { Event } from "@/schemas/event.schema";

const dot = new Date();
dot.setHours(dot.getHours() - 1);

const ev: Event[] = [
	{
		id: 1,
		dateFrom: dot,
		title: "Event title",
		note: "Note",
	},
	{
		id: 1,
		dateFrom: dot,
		title: "Event title",
		note: "Note",
	},
	{
		id: 1,
		dateFrom: dot,
		title: "Event title",
		note: "Note",
	},
];

export default function CalendarPage() {
	const [currentDate, setCurrentDate] = useState(new Date());

	return (
		<>
			<PageHeader
				title="Calendar"
				subtitle="View and manage events"
				controls={
					<Dialog open={false}>
						<DialogTrigger asChild>
							<Button className="w-full sm:w-auto">
								<Plus className="h-4 w-4 mr-2" />
								Add Event
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Add New Event</DialogTitle>
							</DialogHeader>
							{/* <EventForm onSubmit={handleAddEvent} selectedDate={selectedDate} /> */}
						</DialogContent>
					</Dialog>
				}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CalendarIcon className="h-5 w-5" />
								Calendar View
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Calendar
								date={currentDate}
								onDateSelect={setCurrentDate}
								events={ev}
								onMonthViewChange={(a, b) => console.log(a, b)}
							/>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					{/* Selected Date Events */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								{currentDate.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<EventRow
									title="Event title"
									date={currentDate}
									tag="No clue"
								/>
								<EventRow
									title="Event title 2"
									date={currentDate}
									tag="No clue"
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Upcoming Events</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<EventRow
									title="Event title"
									date={currentDate}
									tag="No clue"
								/>
								<EventRow
									title="Event title 2"
									date={currentDate}
									tag="No clue"
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
