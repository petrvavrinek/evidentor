import { calendar } from "@/db/calendar.schema";
import { eq } from "drizzle-orm";
import { db } from "../../database";

export const CalendarService = {
	/**
	 * Find calendars by user ID
	 * @param userId User ID
	 * @returns Array calendars
	 */
	findByUser(userId: string) {
		return db.query.calendar.findMany({ where: eq(calendar.userId, userId) });
	},
};
