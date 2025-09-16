import Elysia, { status } from "elysia";

import { BetterAuthMacro } from "../auth";
import { UpdateUserBillingSchema, UserBillingResponseSchema } from "./user-billing.schema";
import UserBillingService from "./user-billing.service";
import { injectService } from "../../macros/inject-service.macro";

const router = new Elysia({
  prefix: "/user-billing",
  detail: { tags: ["User billing"] },
})
  .use(BetterAuthMacro)
  .use(injectService("userBillingService", UserBillingService))
  .model("UserBilling", UserBillingResponseSchema)
  .get("", async ({ user, userBillingService }) => {
    const userBilling = await userBillingService.findByUserId(user.id);
    if (!userBilling) throw status(404, "Billing not found");
    return userBilling;
  },
    {
      auth: true,
      response: "UserBilling"
    }
  )
  .put("", async ({ user, body, userBillingService }) => {
    const response = await userBillingService.updateByUserId(user.id, body);
    if (!response) throw status(500, "Could not update billing data");
    return response;
  },
    {
      auth: true,
      body: UpdateUserBillingSchema,
      response: "UserBilling"
    })


export default router;
