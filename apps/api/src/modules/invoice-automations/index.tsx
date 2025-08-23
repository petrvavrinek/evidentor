import Elysia, { status, t } from "elysia";

import { pagination } from "../../macros/pagination.macro";
import { PaginationSchema } from "../../schemas/pagination.schema";
import { BetterAuthMacro } from "../auth";
import { ProjectsService } from "../projects/projects.service";
import { CreateInvoiceAutomationRuleSchema, InvoiceAutomationRuleIdParam, SelectInvoiceAutomationRuleSchema, UpdateInvoiceAutomationRuleSchema } from "./invoice-automations.schema";
import { InvoiceAutomationsService } from "./invoice-automations.service";

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
      query: PaginationSchema
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
  .patch(":id", async ({ user, body, params }) => {
    if (body.projectId) {
      const project = await ProjectsService.findById(user.id, body.projectId);
      if (!project) throw status(400, "Invalid project");
    }

    const rule = await InvoiceAutomationsService.updateById(user.id, params.id, body);
    if (!rule) throw status(500, "Could not update invoice automation rule");
    return rule;
  }, {
    auth: true,
    response: "InvoiceAutomation",
    body: UpdateInvoiceAutomationRuleSchema,
    params: InvoiceAutomationRuleIdParam
  })
  .delete(":id", async ({ user, params }) => {
    await InvoiceAutomationsService.deleteById(user.id, params.id);
  },
    {
      auth: true,
      params: InvoiceAutomationRuleIdParam
    })


export default router;