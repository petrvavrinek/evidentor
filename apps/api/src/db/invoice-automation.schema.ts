import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { CurrencyEnum } from "./currency.schema";
import { LanguageEnum } from "./languages.schema";
import { projectTasks } from "./project-tasks.schema";
import { projects } from "./projects.schema";

export const RecurrenceTypeEnum = pgEnum("recurrence_type", [
  "monthly",
  "weekly",
  "daily"
]);

export const invoiceAutomationRules = pgTable("invoice_automation_rules", {
  id: serial().primaryKey(),
  userId: text().references(() => user.id),
  isActive: boolean().default(true).notNull(),
  projectId: integer().references(() => projects.id, { onDelete: "cascade" }).notNull(),

  // Make invoice for all tasks
  allTasks: boolean().notNull(),

  recurrenceType: RecurrenceTypeEnum().notNull(),
  interval: integer().default(1).notNull(),
  dayOfMonth: integer(),

  language: LanguageEnum().notNull(),
  dueDays: integer().default(30).notNull(),
  currency: CurrencyEnum().notNull(),

  nextRunDate: timestamp().notNull(),
  lastRunDate: timestamp(),

  createdAt: timestamp().defaultNow().notNull(),
});

export const invoiceAutomationRuleProjectTasks = pgTable("invoice_automation_rule_project_tasks", {
  ruleId: integer().references(() => invoiceAutomationRules.id, { onDelete: "cascade" }).notNull(),
  projectTaskId: integer().references(() => projectTasks.id, { onDelete: "cascade" }).notNull()
});

export const invoiceAutomationRulesRelations = relations(invoiceAutomationRules, ({ many, one }) => ({
  // Many-to-many relation through junction table
  invoiceAutomationRuleProjectTasks: many(invoiceAutomationRuleProjectTasks),
  project: one(projects, {
    fields: [invoiceAutomationRules.projectId],
    references: [projects.id]
  })
}));

// Relations for the junction table
export const invoiceAutomationRuleProjectTasksRelations = relations(invoiceAutomationRuleProjectTasks, ({ one }) => ({
  invoiceAutomationRule: one(invoiceAutomationRules, {
    fields: [invoiceAutomationRuleProjectTasks.ruleId],
    references: [invoiceAutomationRules.id]
  }),
  projectTask: one(projectTasks, {
    fields: [invoiceAutomationRuleProjectTasks.projectTaskId],
    references: [projectTasks.id]
  })
}));
