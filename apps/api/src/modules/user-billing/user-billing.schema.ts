import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t, type Static } from "elysia";

import { userBilling } from "@/db/user-billing.schema";
import { AddressResponse, CreateAddressSchema } from "../addresses/addresses.schema";

const CreateUserBillingInsertSchema = createInsertSchema(userBilling);
export const UserBillingSelectSchema = createSelectSchema(userBilling);

export const UpdateUserBillingSchema = t.Intersect([
  t.Omit(CreateUserBillingInsertSchema, ["userId", "addressId"]),
  t.Object({
    address: CreateAddressSchema
  })
]);

export const UserBillingResponseSchema = t.Intersect([
  UserBillingSelectSchema,
  t.Object({
    address: AddressResponse
  })
]);

export type UpdateUserBilling = Static<typeof UpdateUserBillingSchema>;
export type UserBillingResponse = Static<typeof UserBillingResponseSchema>;
