import Elysia, { status, t } from "elysia";

import { BetterAuthMacro } from "../auth";
import { CreateInvoiceAutomationRuleSchema, InvoiceAutomationRuleIdParam, SelectInvoiceAutomationRuleSchema } from "./invoice-automations.schema";
import { InvoiceAutomationsService } from "./invoice-automations.service";
import { ProjectsService } from "../projects/projects.service";
import { pagination, withPagination } from "../../macros/pagination.macro";

const router = new Elysia({
  prefix: "/invoice-automations",
  detail: { tags: ["Invoice automations"] },
})
  .use(BetterAuthMacro)
  .use(pagination)
  .model("InvoiceAutomation", SelectInvoiceAutomationRuleSchema)
  .model("InvoiceAutomation[]", t.Array(SelectInvoiceAutomationRuleSchema))
  .post("", async ({ user, body }) => {
    const project = await ProjectsService.findById(user.id, body.projectId);
    if (!project) throw status(400, "Invalid project");

    const rule = await InvoiceAutomationsService.create(user.id, body);
    if (!rule) throw status(500, "Could not create invoice automation");

    return rule;
  }, {
    auth: true,
    body: CreateInvoiceAutomationRuleSchema,
    response: "InvoiceAutomation",
  }
  )
  .get("", async ({ user }) => {
    return InvoiceAutomationsService.findByUserId(user.id);
  },
    {
      auth: true,
      response: "InvoiceAutomation[]",
      paginate: { defaultPageSize: 16 },
      query: withPagination()
    }
  )
  .get(":id", async ({ user, params }) => {
    const rule = await InvoiceAutomationsService.findById(user.id, params.id);
    if (!rule) throw status(404, "Invoice automation rule not found");
    return rule;
  }, {
    auth: true,
    response: "InvoiceAutomation",
    params: InvoiceAutomationRuleIdParam
  })

export default router;