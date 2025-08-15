import type { Static } from "elysia";
import type { ClientResponseSchema, CreateClientSchema, UpdateClientSchema } from "./clients.schema";

export type CreateClient = Static<typeof CreateClientSchema>;
export type UpdateClient = Static<typeof UpdateClientSchema>;
export type SelectClient = Static<typeof ClientResponseSchema>;