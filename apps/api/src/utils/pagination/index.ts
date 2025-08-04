import { type Static, t } from "elysia";

/**
 * Pagination schema
 */
export const PaginationSchema = t.Object({
	/**
	 * Page size
	 */
	pageSize: t.Number({ minimum: 0 }),
	/**
	 * Cursor value (ex. cursor = user id)
	 */
	cursor: t.Number(),
});

/**
 * Pagination type
 */
export type Pagination = Static<typeof PaginationSchema>;
