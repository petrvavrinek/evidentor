import { calendars } from "@/db/calendars.schema";
import { eq } from "drizzle-orm";
import { db } from "../../database";

export const CalendarService = {
	/**
	 * Find calendars by user ID
	 * @param userId User ID
	 * @returns Array calendars
	 */
	findByUser(userId: string) {
		return db.query.calendars.findMany({ where: eq(calendars.userId, userId) });
	},
};
