import { and, eq } from "drizzle-orm";

import { invoiceAutomationRuleProjectTasks, invoiceAutomationRules } from "@/db/invoice-automation.schema";
import { projectTasks } from "@/db/project-tasks.schema";
import { projects } from "@/db/projects.schema";
import { db } from "../../database";
import type { WithTransaction } from "../../types/db";
import type { CreateInvoiceAutomation, SelectInvoiceAutomationRule } from "./invoice-automations.schema";

export const InvoiceAutomationsService = {
  async findByUserId(userId: string): Promise<SelectInvoiceAutomationRule[]> {
    const results = await db.query.invoiceAutomationRules.findMany({
      where: eq(invoiceAutomationRules.userId, userId),
      with: {
        project: {
          with: {
            client: true
          }
        },
        invoiceAutomationRuleProjectTasks: {
          with: {
            projectTask: true
          }
        }
      }
    });

    return results.map(e => ({
      ...e,
      projectTasks: e.invoiceAutomationRuleProjectTasks.map(e => e.projectTask),
      invoiceAutomationRuleProjectTasks: undefined
    }))

  },

  async findById(userId: string, ruleId: number, options?: WithTransaction): Promise<SelectInvoiceAutomationRule | null> {
    const connection = options?.tx ?? db;
    const result = await connection.query.invoiceAutomationRules.findFirst({
      where: and(eq(invoiceAutomationRules.userId, userId), eq(invoiceAutomationRules.id, ruleId)),
      with: {
        project: {
          with: {
            client: true
          }
        },
        invoiceAutomationRuleProjectTasks: {
          with: {
            projectTask: true
          }
        }
      }
    });

    if (!result) return null;

    return {
      ...result,
      projectTasks: result.invoiceAutomationRuleProjectTasks.map((e: any) => e.projectTask),
      invoiceAutomationRuleProjectTasks: undefined
    }
  },

  create(userId: string, data: CreateInvoiceAutomation): Promise<SelectInvoiceAutomationRule | null> {
    const nextRunDate = this.calculateNextRunDate({
      dayOfMonth: data.dayOfMonth!,
      interval: data.interval!,
      nextRunDate: new Date(),
      recurrenceType: data.recurrenceType
    });

    return db.transaction(async tx => {
      const projectTaskIds: number[] = [];

      if (!data.allTasks) {
        const selectedProjectTasks = await tx
          .selectDistinct({ id: projectTasks.id })
          .from(projectTasks)
          .innerJoin(projects, eq(projects.ownerId, userId))
          .where(and(
            eq(projectTasks.projectId, data.projectId),
          ));

        projectTaskIds.push(...selectedProjectTasks.map(e => e.id));
      }

      const [rule] = await tx.insert(invoiceAutomationRules).values({
        allTasks: data.allTasks,
        currency: data.currency,
        language: data.language,
        lastRunDate: null,
        nextRunDate,
        projectId: data.projectId,
        recurrenceType: data.recurrenceType,
        dayOfMonth: data.dayOfMonth,
        dueDays: data.dueDays,
        isActive: data.isActive,
        userId,
        interval: data.interval,
      }).returning();

      // Could not create rule
      if (!rule) return null;

      if (projectTaskIds.length) {
        await tx.insert(invoiceAutomationRuleProjectTasks).values(
          projectTaskIds.map(taskId => ({
            projectTaskId: taskId,
            ruleId: rule.id
          }))
        )
      }

      return this.findById(userId, rule.id, { tx });
    });
  },

  calculateNextRunDate(rule: Pick<typeof invoiceAutomationRules.$inferSelect, "recurrenceType" | "nextRunDate" | "interval" | "dayOfMonth">): Date {
    const now = new Date();
    let nextDate = new Date(rule.nextRunDate);

    switch (rule.recurrenceType) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + rule.interval);
        break;

      case "weekly":
        nextDate.setDate(nextDate.getDate() + (rule.interval * 7));
        break;

      case "monthly":
        const currentMonth = nextDate.getMonth();

        // Add the interval months
        nextDate.setMonth(currentMonth + rule.interval);

        // Set to the desired day of month (if specified)
        if (rule.dayOfMonth) {
          nextDate.setDate(rule.dayOfMonth);

          // Handle edge case: if dayOfMonth doesn't exist in target month
          if (nextDate.getDate() !== rule.dayOfMonth) {
            // The date rolled over, so go to last day of previous month
            nextDate.setDate(0);
          }
        }
        break;

      default:
        throw new Error(`Unknown recurrence type: ${rule.recurrenceType}`);
    }
    return nextDate;

  }
}