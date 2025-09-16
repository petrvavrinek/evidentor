import Elysia, { status, t } from "elysia";

import { pagination } from "../../macros/pagination.macro";
import { PaginationSchema } from "../../schemas/pagination.schema";
import { BetterAuthMacro } from "../auth";
import { ProjectsService } from "../projects/projects.service";
import { InvoiceAutomationsTriggerService } from "./invoice-automations-trigger.service";
import { CreateInvoiceAutomationRuleSchema, InvoiceAutomationRuleIdParam, SelectInvoiceAutomationRuleSchema, UpdateInvoiceAutomationRuleSchema } from "./invoice-automations.schema";
import { InvoiceAutomationsService } from "./invoice-automations.service";
import { injectService } from "../../macros/inject-service.macro";
import Container from "typedi";

const router = new Elysia({
  prefix: "/invoice-automations",
  detail: { tags: ["Invoice automations"] },
})
  .use(BetterAuthMacro)
  .use(pagination)
  .use(injectService("automationService", InvoiceAutomationsService))
  .use(injectService("projectsService", ProjectsService))
  .model("InvoiceAutomation", SelectInvoiceAutomationRuleSchema)
  .model("InvoiceAutomation[]", t.Array(SelectInvoiceAutomationRuleSchema))
  .post("", async ({ user, body, automationService }) => {
    const project = await automationService.findById(user.id, body.projectId);
    if (!project) throw status(400, "Invalid project");

    const rule = await automationService.create(user.id, body);
    if (!rule) throw status(500, "Could not create invoice automation");

    return rule;
  }, {
    auth: true,
    body: CreateInvoiceAutomationRuleSchema,
    response: "InvoiceAutomation",
  }
  )
  .get("", async ({ user, automationService }) => {
    return automationService.findByUserId(user.id);
  },
    {
      auth: true,
      response: "InvoiceAutomation[]",
      paginate: { defaultPageSize: 16 },
      query: PaginationSchema
    }
  )
  .get(":id", async ({ user, params, automationService }) => {
    const rule = await automationService.findById(user.id, params.id);;
    if (!rule) throw status(404, "Invoice automation rule not found");
    return rule;
  }, {
    auth: true,
    response: "InvoiceAutomation",
    params: InvoiceAutomationRuleIdParam
  })
  .patch(":id", async ({ user, body, params, projectsService, automationService }) => {
    if (body.projectId) {
      const project = await projectsService.findById(user.id, body.projectId);
      if (!project) throw status(400, "Invalid project");
    }

    const rule = await automationService.updateById(user.id, params.id, body);
    if (!rule) throw status(500, "Could not update invoice automation rule");
    return rule;
  }, {
    auth: true,
    response: "InvoiceAutomation",
    body: UpdateInvoiceAutomationRuleSchema,
    params: InvoiceAutomationRuleIdParam
  })
  .delete(":id", async ({ user, params, automationService }) => {
    await automationService.deleteById(user.id, params.id);
  },
    {
      auth: true,
      params: InvoiceAutomationRuleIdParam
    })

router.on("start", () => {
  Container.get(InvoiceAutomationsTriggerService).start();
});

export default router;