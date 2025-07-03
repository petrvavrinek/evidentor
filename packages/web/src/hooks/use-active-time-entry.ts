"use client";

import { useContext } from "react";
import { ActiveTimeEntryContext } from "@/contexts/active-time-entry";

export default function useActiveTimeEntry() {
	const context = useContext(ActiveTimeEntryContext);

	return {
		active: context.active,
		setActive: context.setActive,
	};
}
