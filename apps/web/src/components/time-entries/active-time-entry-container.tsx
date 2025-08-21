"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import useActiveTimeEntry from "@/hooks/use-active-time-entry";
import { getTimeEntriesActive } from "@/lib/api";
import {
	getTimeEntriesActiveQueryKey,
	patchTimeEntriesByIdMutation,
} from "@/lib/api/@tanstack/react-query.gen";
import { ActiveTimeEntryCard } from "./active-time-entry-card";

export default function ActiveTimeEntryContainer() {
	const { active, setActive } = useActiveTimeEntry();
	const { data: timeEntry, isLoading } = useQuery({
		queryKey: getTimeEntriesActiveQueryKey(),
		queryFn: () => getTimeEntriesActive(),
	});

	const updateTimeEntryMutation = useMutation({
		...patchTimeEntriesByIdMutation(),
		onSuccess: () => setActive(null),
	});

	useEffect(() => {
		setActive(timeEntry ?? null);
	}, [timeEntry, setActive]);

	const handleStop = () => {
		if (!active) return;

		setActive(null);

		updateTimeEntryMutation.mutateAsync({
			path: { id: active.id },
			body: {
				endAt: new Date(),
			},
		});
	};

	if (isLoading || !active) return;

	return (
		<div className="fixed bottom-2 right-2 z-10">
			<ActiveTimeEntryCard timeEntry={active} handleStop={handleStop} />
		</div>
	);
}
