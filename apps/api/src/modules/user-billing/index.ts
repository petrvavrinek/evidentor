import Elysia, { status } from "elysia";

import { BetterAuthMacro } from "../auth";
import { UpdateUserBillingSchema, UserBillingResponseSchema } from "./user-billing.schema";
import UserBillingService from "./user-billing.service";

const router = new Elysia({
  prefix: "/user-billing",
  detail: { tags: ["User billing"] },
})
  .use(BetterAuthMacro)
  .model("UserBilling", UserBillingResponseSchema)
  .get("", async ({ user }) => {
    const userBilling = await UserBillingService.findByUserId(user.id);
    if (!userBilling) throw status(404, "Billing not found");
    return userBilling;
  },
    {
      auth: true,
      response: "UserBilling"
    }
  )
  .put("", async ({ user, body }) => {
    const response = await UserBillingService.updateByUserId(user.id, body);
    if (!response) throw status(500, "Could not update billing data");
    return response;
  },
    {
      auth: true,
      body: UpdateUserBillingSchema,
      response: "UserBilling"
    })


export default router;
