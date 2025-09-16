import Elysia, { status } from "elysia";

import { BetterAuthMacro } from "../auth";

import {
	ClientIdParamSchema,
	ClientResponseSchema,
	ClientsResponseSchema,
	CreateClientSchema,
	UpdateClientSchema,
} from "./clients.schema";

import { pagination } from "../../macros/pagination.macro";
import { PaginationSchema } from "../../schemas/pagination.schema";
import { ClientsService } from "./clients.service";
import { injectService } from "../../macros/inject-service.macro";

const router = new Elysia({
	prefix: "/clients",
	detail: { tags: ["Clients"] },
})
	.use(BetterAuthMacro)
	.use(pagination)
	.use(injectService("clientsService", ClientsService))
	.model("Client", ClientResponseSchema)
	.model("Client[]", ClientsResponseSchema)
	.get(
		"",
		({ user, clientsService }) => clientsService.findManyByUserId(user.id),
		{
			auth: true,
			detail: {
				description: "Get all user-defined clients",
			},
			response: "Client[]",
			query: PaginationSchema
		},
	)
	.post(
		"",
		async ({ user, body, clientsService }) => {
			const client = await clientsService.create(user.id, body);

			if (!client) throw status(500, "Could not create client");
			return client as never;
		},
		{
			auth: true,
			body: CreateClientSchema,
			detail: {
				description: "Create new client",
			},
			response: "Client",
		},
	)
	.get(
		":id",
		async ({ params, user, clientsService }) => {
			const { id } = params;
			const foundClient = await clientsService.findById(user.id, id);
			if (!foundClient) throw status(404, "Client not found");
			return foundClient;
		},
		{
			auth: true,
			params: ClientIdParamSchema,
			detail: {
				description: "Get user-defined client by ID",
			},
			response: "Client",
		},
	)
	.patch(
		":id",
		async ({ params, body, user, clientsService }) => {
			const { id } = params;

			await clientsService.updateById(user.id, id, body);
			const updatedClient = await clientsService.findById(user.id, id)
			if (!updatedClient) throw status(404, "Client not found");
			return updatedClient;
		},
		{
			auth: true,
			body: UpdateClientSchema,
			params: ClientIdParamSchema,
			detail: {
				description: "Update user-defined client data",
			},
			response: "Client",
		},
	)
	.delete(
		":id",
		async ({ params, user, clientsService }) => {
			const { id } = params;

			await clientsService.deleteById(user.id, id);
		},
		{
			auth: true,
			params: ClientIdParamSchema,
			detail: {
				description:
					"Delete user-defined client, all projects containing this client will be unset",
			},
		},
	);

export default router;
