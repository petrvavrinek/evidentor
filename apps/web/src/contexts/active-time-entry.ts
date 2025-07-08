import { createContext } from "react";
import type { TimeEntry } from "@/lib/api";

export interface TimeEntryContextContent {
	/**
	 * Set current active time entry
	 * @param newTimeEntry New time entry (use null to clear state)
	 * @returns 
	 */
	setActive: (newTimeEntry: TimeEntry | null) => void;
	active: TimeEntry | null;
}

export const ActiveTimeEntryContext = createContext<TimeEntryContextContent>({
	active: null,
	setActive: () => {},
});
