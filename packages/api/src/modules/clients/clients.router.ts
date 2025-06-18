import Elysia, { status } from "elysia";

import { betterAuth } from "../../auth/index";

import {
  ClientIdParam,
  ClientResponse,
  ClientsResponse,
  CreateClient,
  UpdateClient,
} from "./clients.dto";
import { ClientsService } from "./clients.service";

export const router = new Elysia({
  prefix: "/client",
  detail: { tags: ["Client"] },
})
  .use(betterAuth)
  .model("Client", ClientResponse)
  .model("Client[]", ClientsResponse)
  .get(
    "",
    async ({ user }) => {
      return ClientsService.findManyByUserId(user.id);
    },
    {
      auth: true,
      detail: {
        description: "Get all user-defined clients",
      },
      response: "Client[]",
    }
  )
  .post(
    "",
    async (c) => {
      const { user, body } = c;
      return ClientsService.create(user.id, body);
    },
    {
      auth: true,
      body: CreateClient,
      detail: {
        description: "Create new user-defined client",
      },
      response: "Client",
    }
  )
  .get(
    ":id",
    async ({ params, user }) => {
      const { id } = params;
      const foundClient = await ClientsService.findById(user.id, id);
      if (!foundClient) throw status(404, "Client not found");
      return foundClient;
    },
    {
      auth: true,
      params: ClientIdParam,
      detail: {
        description: "Get user-defined client by ID",
      },
      response: "Client",
    }
  )
  .patch(
    ":id",
    async ({ params, body, user }) => {
      const { id } = params;

      const updatedClient = await ClientsService.updateById(user.id, id, body);

      if (!updatedClient) throw status(404, "Client not found");
      return updatedClient;
    },
    {
      auth: true,
      body: UpdateClient,
      params: ClientIdParam,
      detail: {
        description: "Update user-defined client data",
      },
      response: "Client",
    }
  )
  .delete(
    ":id",
    async ({ params, user }) => {
      const { id } = params;

      await ClientsService.deleteById(user.id, id);
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
