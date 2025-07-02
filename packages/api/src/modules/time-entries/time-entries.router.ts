import { Elysia, status } from "elysia";
import { betterAuth } from "../../auth/auth.middleware";
import {
	CreateTimeEntry,
	TimeEntriesResponse,
	TimeEntryIdParam,
	TimeEntryQuery,
	TimeEntryResponse,
	UpdateTimeEntry,
} from "./time-entries.dto";
import { TimeEntriesService } from "./time-entries.service";

export const router = new Elysia({
	prefix: "/time-entry",
	detail: { tags: ["Timer"] },
})
	.use(betterAuth)
	.model("TimeEntry", TimeEntryResponse)
	.model("TimeEntry[]", TimeEntriesResponse)
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
		async ({ user }) => {
			return await TimeEntriesService.findByUserId(user.id);
		},
		{
			auth: true,
			response: "TimeEntry[]",
		},
	)
	.post(
		"",
		async ({ user, body }) => {
			const createdTimeEntry = await TimeEntriesService.create(user.id, body);
			if (!createdTimeEntry) throw status(500, "Could not create time entry");
			return await TimeEntriesService.findById(user.id, createdTimeEntry.id);
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
			if (!entry) return status(404, "Time entry not found");
			return entry;
		},
		{
			params: TimeEntryIdParam,
			body: UpdateTimeEntry,
			auth: true,
			detail: {
				description: "Update existing time entry",
				responses: {
					404: {
						description: "Time entry not found",
					},
					200: {
						description: "Time entry updated",
					},
				},
			},
		},
	);
