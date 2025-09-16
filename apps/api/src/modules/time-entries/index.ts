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
import { injectService } from "../../macros/inject-service.macro";


const router = new Elysia({
	prefix: "/time-entries",
	detail: { tags: ["Timer"] },
})
	.use(BetterAuthMacro)
	.use(pagination)
	.use(injectService("timeEntriesService", TimeEntriesService))
	.model("TimeEntry", TimeEntryResponse)
	.model("TimeEntry[]", TimeEntriesResponse)
	.model("TimeEntryDurationByDate", TimeEntryDurationByDate)
	.get(
		"/active",
		async ({ user, timeEntriesService }) => {
			const entry = await timeEntriesService.getActiveByUserId(user.id);
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
		async ({ user, params: { id }, timeEntriesService }) => {
			const entry = await timeEntriesService.findById(user.id, id);

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
		({ user, query, pagination, timeEntriesService }) => {
			return timeEntriesService.findByUserId(user.id, query, pagination);
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
		async ({ user, body, timeEntriesService }) => {
			const createdTimeEntry = await timeEntriesService.create(user.id, body);
			if (!createdTimeEntry) throw status(500, "Could not create time entry");
			return (await timeEntriesService.findById(user.id, createdTimeEntry.id))!;
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
		async ({ user, params: { id }, body, timeEntriesService }) => {
			const entry = await timeEntriesService.updateById(user.id, id, body);
			if (!entry) throw status(404, "Time entry not found");
			return (await timeEntriesService.findById(user.id, entry.id))!;
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
		async ({ user, params: { id }, timeEntriesService }) => {
			const entry = await timeEntriesService.findById(user.id, id);
			if (!entry) throw status(404, "Time entry not found");

			await timeEntriesService.deleteById(user.id, entry.id);
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
		async ({ user, query, timeEntriesService }) => {
			return timeEntriesService.getDurationEachDate(user.id, query);
		},
		{ auth: true, query: TimeEntryFilter, response: "TimeEntryDurationByDate" },
	);

// TimeEntriesService.getDurationEachDate("q2xXlchLxHLwo8HnRsiauIpF1d7WAa9O");
export default router;
