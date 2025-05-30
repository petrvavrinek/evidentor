import { and, eq } from "drizzle-orm";
import { Elysia, status } from "elysia";

import { betterAuth } from "../../auth/auth.middleware";
import { db } from "../../database";
import { timeEntry } from "../../db/schema";
import {
  CreateTimeEntry,
  TimeEntryIdParam,
  UpdateTimeEntry,
} from "./time-entries.dto";

export const router = new Elysia({
  prefix: "/v1/time-entry",
  detail: { tags: ["Timer"] },
})
  .use(betterAuth)
  .get(
    "/active",
    async ({ user }) => {
      const entry = await db.query.timeEntry.findFirst({
        where: ({ userId, endAt }, { eq, isNull, and }) =>
          and(eq(userId, user.id), isNull(endAt)),
      });

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
      const entry = await db.query.timeEntry.findFirst({
        where: (schema, { eq, isNull, and }) =>
          and(eq(schema.userId, user.id), eq(schema.id, id)),
      });

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
      if (!body.endAt) {
        const entry = await db.query.timeEntry.findFirst({
          where: ({ userId, endAt }, { eq, isNull, and }) =>
            and(eq(userId, user.id), isNull(endAt)),
        });
        if (entry) return status(409, "Running time entry already exist");
      }

      const [entry] = await db
        .insert(timeEntry)
        .values({
          userId: user.id,
          endAt: body.endAt,
          startAt: body.startAt,
          title: body.title,
        })
        .returning();
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
      const entry = await db
        .update(timeEntry)
        .set(body)
        .where(and(eq(timeEntry.id, id), eq(timeEntry.userId, user.id)))
        .returning();

      if (!entry.length) return status(404, "Time entry not found");

      return entry[0];
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
