"use client";

import { Square } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent } from "@evidentor/ui/components/ui/card";

import type { TimeEntry } from "@/lib/api";
import { formatTime } from "@/lib/format-time";

interface ActiveTimeEntryProps {
	timeEntry: TimeEntry;
	handleStop?: () => void;
}

export function ActiveTimeEntryCard({
	timeEntry,
	handleStop,
}: ActiveTimeEntryProps) {
	const [timeMs, setTimeMs] = useState(0);

	useEffect(() => {
		const updateTimeMs = () => {
			const now = new Date();
			const d = new Date(timeEntry.startAt as string);
			setTimeMs(now.getTime() - d.getTime());
		};

		updateTimeMs();

		const intervalRef = setInterval(updateTimeMs, 1000);
		return () => {
			clearInterval(intervalRef);
		};
	}, [timeEntry.startAt]);

	// Timer
	return (
		<div className="fixed bottom-6 right-6 z-50 w-72 max-w-[calc(100vw-3rem)]">
			<Card className="border shadow-lg p-0">
				<CardContent className="p-4">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
							<span className="text-sm font-medium">Active Timer</span>
						</div>
						<Button
							onClick={handleStop}
							size="sm"
							variant="outline"
							className="h-8 px-3 bg-transparent"
						>
							<Square className="h-3 w-3 mr-1" />
							Stop
						</Button>
					</div>

					<div className="space-y-2">
						{timeEntry.project && (
							<div className="font-medium text-sm truncate">
								{timeEntry.project.title}
							</div>
						)}

						{timeEntry.projectTask && (
							<div className="text-sm text-muted-foreground truncate">
								{timeEntry.projectTask.title}
							</div>
						)}

						{timeEntry.title && (
							<div className="text-xs text-muted-foreground truncate">
								{timeEntry.title}
							</div>
						)}

						<div className="text-xl font-mono font-semibold pt-1">
							{formatTime(timeMs)}
						</div>

						{timeEntry.project?.client && (
							<div className="text-xs text-muted-foreground pt-1 border-t">
								{timeEntry.project.client.companyName}
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
