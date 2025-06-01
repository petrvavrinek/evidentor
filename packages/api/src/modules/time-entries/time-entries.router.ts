import { Elysia, status } from "elysia";
import { betterAuth } from "../../auth/auth.middleware";
import {
  CreateTimeEntry,
  TimeEntryIdParam,
  UpdateTimeEntry,
} from "./time-entries.dto";
import { TimeEntriesService } from "./time-entries.service";

export const router = new Elysia({
  prefix: "/v1/time-entry",
  detail: { tags: ["Timer"] },
})
  .use(betterAuth)
  .get(
    "/active",
    async ({ user }) => {
      const entry = await TimeEntriesService.getActiveByUserId(user.id);
      if (entry) return status(200, entry);
      return status(404);
    },
    {
      detail: {
        description: "Test description",
        hide: false,
        responses: {
          200: {
            description: "Active time entry found",
          },
          404: {
            description: "Active time entry does not exist",
          },
        },
      },
      auth: true,
    }
  )
  .get(
    ":id",
    async ({ user, params: { id } }) => {
      const entry = await TimeEntriesService.findById(user.id, id);

      if (!entry) return status(404, "Time entry not found");
      return entry;
    },
    {
      params: TimeEntryIdParam,
      auth: true,
      detail: {
        description: "Return time entry by ID",
        responses: {
          200: {
            description: "Time entry found and returned",
          },
          404: {
            description: "Time entry not found",
          },
        },
      },
    }
  )
  .post(
    "",
    async ({ user, body }) => {
      const entry = await TimeEntriesService.create(user.id, body);
      return entry;
    },
    {
      body: CreateTimeEntry,
      auth: true,
      detail: {
        description: "Create new time entry",
        responses: {
          409: {
            description: "Running time entry already exist",
          },
          201: {
            description: "Time entry created",
          },
        },
      },
    }
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
    }
  );
