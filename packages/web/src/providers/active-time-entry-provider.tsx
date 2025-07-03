"use client";

import { type ReactNode, useState } from "react";

import { ActiveTimeEntryContext } from "@/contexts/active-time-entry";
import type { TimeEntry } from "@/lib/api";

interface ActiveTimeEntryProviderProps {
	children?: ReactNode;
}

export default function ActiveTimeEntryProvider(
	props: ActiveTimeEntryProviderProps,
) {
	const [timeEntry, setTimeEntry] = useState<TimeEntry | null>(null);

	return (
		<ActiveTimeEntryContext.Provider
			value={{ active: timeEntry, setActive: setTimeEntry }}
		>
			{props.children}
		</ActiveTimeEntryContext.Provider>
	);
}
