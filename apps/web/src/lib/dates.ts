export const getMonthNames = (
	format: "long" | "short" | "narrow",
	lang = "en-us",
): string[] => {
	const monthNames: string[] = [];

	for (let i = 1; i < 13; i++) {
		const date = new Date(`1970-${i}-01`);

		monthNames.push(date.toLocaleString(lang, { month: format }));
	}
	return monthNames;
};

export const getDayNames = (
	format: "long" | "short" | "narrow",
	lang = "en-us",
): string[] => {
	const dayNames: string[] = [];
	for (let i = 1; i < 8; i++) {
		const date = new Date(`1970-01-0${i + 3}`);
		dayNames.push(date.toLocaleString(lang, { weekday: format }));
	}
	return dayNames;
};

/**
 * Returns date with first day of week
 * @param date Date
 * @param firstDayOfWeekIndex First day of week index (0 - sunday, 1 - monday, ...)
 * @returns Date
 */
export const firstDayOfWeek = (date: Date, firstDayOfWeekIndex: number) => {
	const dayOfWeek = date.getDay(),
		firstDayOfWeek = new Date(date),
		diff =
			dayOfWeek >= firstDayOfWeekIndex
				? dayOfWeek - firstDayOfWeekIndex
				: 6 - dayOfWeek;

	firstDayOfWeek.setDate(date.getDate() - diff);
	firstDayOfWeek.setHours(0, 0, 0, 0);
	return firstDayOfWeek;
};

export const toDateOnly = (date: Date) => {
	const n = new Date(date);
	n.setMilliseconds(0);
	n.setSeconds(0);
	n.setMinutes(0);
	n.setHours(0);
	return n;
};

export const createDatesBetween = (a: Date, b: Date): Date[] => {
	const start = new Date(Math.min(a.getTime(), b.getTime()));
	const end = new Date(Math.max(a.getTime(), b.getTime()));
	const dates: Date[] = [];

	const current = new Date(start);
	while (current <= end) {
		dates.push(new Date(current)); // Push a copy to avoid reference issues
		current.setDate(current.getDate() + 1);
	}

	return dates;
};

/**
 * Check if two dates are same
 * @param a A
 * @param b B
 * @returns True if same
 */
export const isDateSame = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();
