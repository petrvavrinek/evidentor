"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import useActiveTimeEntry from "@/hooks/use-active-time-entry";
import { getTimeEntryActive } from "@/lib/api";
import {
	getTimeEntryActiveQueryKey,
	patchTimeEntryByIdMutation,
} from "@/lib/api/@tanstack/react-query.gen";
import { ActiveTimeEntryCard } from "./active-time-entry-card";

export default function ActiveTimeEntryContainer() {
	const { active, setActive } = useActiveTimeEntry();
	const { data, isLoading } = useQuery({
		queryKey: getTimeEntryActiveQueryKey(),
		queryFn: () => getTimeEntryActive(),
	});

	const updateTimeEntryMutation = useMutation({
		...patchTimeEntryByIdMutation(),
		onSuccess: () => setActive(null),
	});

	useEffect(() => {
		// Loading or error
		if (!data) return;
		const { data: timeEntry } = data;

		setActive(timeEntry ?? null);
	}, [data, setActive]);

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
