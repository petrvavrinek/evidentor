import { Elysia, status, t } from "elysia";
import { BetterAuthMacro } from "../auth";
import {
	CreateTimeEntry,
	TimeEntriesResponse,
	TimeEntryDurationByDate,
	TimeEntryFilter,
	TimeEntryIdParam,
	TimeEntryResponse,
	UpdateTimeEntry,
} from "./time-entries.dto";
import { TimeEntriesService } from "./time-entries.service";
import { pagination, withPagination } from '../../macros/pagination.macro';


const router = new Elysia({
	prefix: "/time-entries",
	detail: { tags: ["Timer"] },
})
	.use(BetterAuthMacro)
	.use(pagination)
	.model("TimeEntry", TimeEntryResponse)
	.model("TimeEntry[]", TimeEntriesResponse)
	.model("TimeEntryDurationByDate", TimeEntryDurationByDate)
	.get(
		"/active",
		async ({ user }) => {
			const entry = await TimeEntriesService.getActiveByUserId(user.id);
			if (!entry) throw status(404);

			return entry;
		},
		{
			auth: true,
			response: "TimeEntry",
			detail: {
				description: "Get active time entry",
			},
		},
	)
	.get(
		":id",
		async ({ user, params: { id } }) => {
			const entry = await TimeEntriesService.findById(user.id, id);

			if (!entry) throw status(404, "Time entry not found");

			return entry;
		},
		{
			auth: true,
			params: TimeEntryIdParam,
			detail: {
				description: "Return time entry by ID",
			},
			response: {
				200: "TimeEntry",
			},
		},
	)
	.get(
		"",
		({ user, query, pagination }) => {
			return TimeEntriesService.findByUserId(user.id, query, pagination);
		},
		{
			auth: true,
			paginate: { defaultPageSize: 10 },
			response: "TimeEntry[]",
			query: withPagination(TimeEntryFilter),

		},
	)
	.post(
		"",
		async ({ user, body }) => {
			const createdTimeEntry = await TimeEntriesService.create(user.id, body);
			if (!createdTimeEntry) throw status(500, "Could not create time entry");
			return (await TimeEntriesService.findById(user.id, createdTimeEntry.id))!;
		},
		{
			body: CreateTimeEntry,
			auth: true,
			detail: {
				description: "Create new time entry",
				// responses: {
				//   409: {
				//     description: "Running time entry already exist",
				//   },
				//   201: {
				//     description: "Time entry created",
				//   },
				// },
			},
			response: "TimeEntry",
		},
	)
	.patch(
		":id",
		async ({ user, params: { id }, body }) => {
			const entry = await TimeEntriesService.updateById(user.id, id, body);
			if (!entry) throw status(404, "Time entry not found");
			return (await TimeEntriesService.findById(user.id, entry.id))!;
		},
		{
			params: TimeEntryIdParam,
			body: UpdateTimeEntry,
			auth: true,
			detail: {
				description: "Update existing time entry",
			},
			response: "TimeEntry",
		},
	)
	.delete(
		":id",
		async ({ user, params: { id } }) => {
			const entry = await TimeEntriesService.findById(user.id, id);
			if (!entry) throw status(404, "Time entry not found");

			await TimeEntriesService.deleteById(user.id, entry.id);
		},
		{
			params: TimeEntryIdParam,
			auth: true,
			detail: {
				description: "Delete time entry",
				responses: {
					200: { description: "Time entry deleted" },
					404: {
						description: "Time entry not found",
					},
				},
			},
		},
	)
	.get(
		"analyze/duration-by-date",
		async ({ user, query }) => {
			return TimeEntriesService.getDurationEachDate(user.id, query);
		},
		{ auth: true, query: TimeEntryFilter, response: "TimeEntryDurationByDate" },
	);

// TimeEntriesService.getDurationEachDate("q2xXlchLxHLwo8HnRsiauIpF1d7WAa9O");
export default router;
