import { addresses } from "@/db/address.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

const InsertAddressSchema = createInsertSchema(addresses);

export const CreateAddressSchema = t.Pick(InsertAddressSchema, [
  "streetLine1",
  "streetLine2",
  "city",
  "state",
  "postalCode",
  "country",
]);

// TODO: Optional
export const UpdateAddressSchema = t.Optional(CreateAddressSchema, true);
export const AddressResponse = createSelectSchema(addresses);