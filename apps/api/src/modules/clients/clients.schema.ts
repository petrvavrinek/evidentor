import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

import { clients } from "@/db/schema";
import { AddressResponse, CreateAddressSchema } from "../addresses/addresses.schema";

// Clients
const InsertClient = createInsertSchema(clients);

/**
 * Create client schema
 */
export const CreateClientSchema = t.Intersect([
  t.Pick(InsertClient, [
    "companyName",
    "contactName",
    "email"
  ]),
  t.Object({
    address: t.Optional(CreateAddressSchema),
  })
]);

/**
 * Update client schema
 */
export const UpdateClientSchema = t.Partial(CreateClientSchema);

/**
 * Client ID parameter
 */
export const ClientIdParamSchema = t.Object({
  id: t.Number(),
});


export const RawClientSelectSchema = createSelectSchema(clients);

/**
 * Select client schema
 */
const SelectClient = t.Intersect(
  [
    t.Pick(RawClientSelectSchema, [
      "id",
      "companyName",
      "contactName",
      "email",
    ]),
    t.Object({
      address: t.Nullable(AddressResponse),
    })
  ]);

/**
 * Client response
 */
export const ClientResponseSchema = t.Omit(SelectClient, ["ownerId"]);

/**
 * Clients response
 */
export const ClientsResponseSchema = t.Array(ClientResponseSchema);
