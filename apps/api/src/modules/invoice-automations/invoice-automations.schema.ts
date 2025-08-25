import { invoiceAutomationRules } from "@/db/invoice-automation.schema";
import { projectTasks } from "@/db/project-tasks.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t, type Static } from "elysia";
import { ProjectResponse } from "../projects/projects.dto";

const InsertInvoiceAutomationRuleSchema = createInsertSchema(invoiceAutomationRules);
export const CreateInvoiceAutomationRuleSchema = t.Intersect([
  t.Omit(
    InsertInvoiceAutomationRuleSchema,
    [
      "userId",
      "createdAt",
      "lastRunDate",
      "nextRunDate",
      "id"
    ]
  ),
  t.Object({
    projectTaskIds: t.Optional(t.Array(t.Number()))
  })
]);

export type CreateInvoiceAutomation = Static<typeof CreateInvoiceAutomationRuleSchema>;

const CreateSelectInvoiceAutomationRuleSchema = createSelectSchema(invoiceAutomationRules);
const SelectProjectTaskSchema = createSelectSchema(projectTasks);

export const SelectInvoiceAutomationRuleSchema = t.Intersect([
  t.Omit(CreateSelectInvoiceAutomationRuleSchema, ["invoiceAutomationRuleProjectTasks"]),
  t.Object({
    projectTasks: t.Array(
      t.Intersect([
        SelectProjectTaskSchema,
        t.Object({ id: t.Number() })
      ])
    ),
    project: ProjectResponse
  })
]);

export type SelectInvoiceAutomationRule = Static<typeof SelectInvoiceAutomationRuleSchema>;

export const InvoiceAutomationRuleIdParam = t.Object({
  id: t.Number()
})

export const UpdateInvoiceAutomationRuleSchema = CreateInvoiceAutomationRuleSchema;
export type UpdateInvoiceAutomationRule = Static<typeof UpdateInvoiceAutomationRuleSchema>;