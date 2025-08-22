import { invoiceAutomationRules } from "@/db/invoice-automation.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t, type Static } from "elysia";
import { ProjectTaskResponse } from "../project-tasks/project-tasks.dto";
import { ProjectResponse } from "../projects/projects.dto";
import { projectTasks } from "@/db/project-tasks.schema";

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
    projectTasks: t.Array(SelectProjectTaskSchema),
    project: ProjectResponse
  })
]);

export type SelectInvoiceAutomationRule = Static<typeof SelectInvoiceAutomationRuleSchema>;