import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

import { client } from "@/db/schema";

const InsertClient = createInsertSchema(client);

/**
 * Create client schema
 */
export const CreateClient = t.Pick(InsertClient, [
  "companyName",
  "contactName",
  "email"
]);

/**
 * Update client schema
 */
export const UpdateClient = t.Partial(CreateClient);

/**
 * Client ID parameter
 */
export const ClientIdParam = t.Object({
  id: t.Number(),
});

/**
 * Select client schema
 */
const SelectClient = t.Object({
  ...createSelectSchema(client).properties,
});

/**
 * Client response
 */
export const ClientResponse = t.Omit(SelectClient, ["ownerId"]);

/**
 * Clients response
 */
export const ClientsResponse = t.Array(ClientResponse);
