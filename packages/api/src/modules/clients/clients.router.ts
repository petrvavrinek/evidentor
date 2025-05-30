import Elysia, { status } from "elysia";
import { db } from "../../database";
import { betterAuth } from "../../auth/index";
import { client } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { ClientIdParam, CreateClient, UpdateClient } from "./clients.dto";

export const router = new Elysia({
  prefix: "/v1/client",
  detail: { tags: ["Client"] },
})
  .use(betterAuth)
  .get(
    "",
    async ({ user }) => {
      const clients = await db.query.client.findMany({
        where: eq(client.ownerId, user.id),
      });
      return clients;
    },
    {
      auth: true,
      detail: {
        description: "Get all user-defined clients",
      },
    }
  )
  .post(
    "",
    async (c) => {
      const { name } = c.body;
      const { user } = c;

      const newClient = await db
        .insert(client)
        .values({
          name,
          ownerId: user.id,
        })
        .returning();

      if (!newClient.length) return status(500, "Internal Server Error");
      return newClient[0];
    },
    {
      auth: true,
      body: CreateClient,
      detail: {
        description: "Create new user-defined client",
      },
    }
  )
  .get(
    ":id",
    async ({ params, user }) => {
      const { id } = params;

      const foundClient = await db.query.client.findFirst({
        where: and(eq(client.id, id), eq(client.ownerId, user.id)),
      });

      if (!foundClient) return status(404, "Client not found");
      return foundClient;
    },
    {
      auth: true,
      params: ClientIdParam,
      detail: {
        description: "Get user-defined client by ID",
      },
    }
  )
  .patch(
    ":id",
    async ({ params, body, user }) => {
      const { id } = params;
      const updatedClient = await db
        .update(client)
        .set(body)
        .where(and(eq(client.id, id), eq(client.ownerId, user.id)))
        .returning();

      if (!updatedClient) return status(404, "Client not found");
      return updatedClient[0];
    },
    {
      auth: true,
      body: UpdateClient,
      params: ClientIdParam,
      detail: {
        description: "Update user-defined client data",
      },
    }
  )
  .delete(
    ":id",
    async ({ params, user }) => {
      const { id } = params;

      await db
        .delete(client)
        .where(and(eq(client.id, id), eq(client.ownerId, user.id)));
    },
    {
      auth: true,
      params: ClientIdParam,
      detail: {
        description:
          "Delete user-defined client, all projects containing this client will be unset",
      },
    }
  );
