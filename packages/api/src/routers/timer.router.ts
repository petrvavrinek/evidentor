import { Elysia, status } from "elysia";
import { betterAuth } from "../auth.middleware";
import { db } from "../database";

export const timerRouter = new Elysia({
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

      if (entry) return entry;
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
  );
