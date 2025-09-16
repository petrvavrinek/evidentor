import { LoggerService } from "@evidentor/logging";
import { and, eq, inArray } from "drizzle-orm";

import { invoiceAutomationRules } from "@/db/invoice-automation.schema";
import { timeEntries } from "@/db/time-entries.schema";
import { db } from "../../database";
import type { InvoiceCreateType } from "../invoices/invoice.schemas";
import { InvoicesService } from "../invoices/invoices.service";
import { TimeEntriesService } from "../time-entries/time-entries.service";
import type { SelectInvoiceAutomationRule } from "./invoice-automations.schema";
import { InvoiceAutomationsService } from "./invoice-automations.service";

const logger = new LoggerService("InvoiceAutomationsTriggerService");

export class InvoiceAutomationsTriggerService {
  isProcessing = false;
  intervalId?: NodeJS.Timeout;

  constructor(
    private readonly invoiceAutomationsService: InvoiceAutomationsService,
    private readonly invoiceService: InvoicesService,
    private readonly timeEntriesService: TimeEntriesService
  ) { }

  /**
   * Start trigger
   * @param interval How often processing should be checked
   * @returns 
   */
  start(interval = 5 * 60 * 1000) {
    // Already started
    if (this.isProcessing) return;

    this.intervalId = setInterval(async () => {
      if (!this.isProcessing) {
        await this.processDueRules();
      }
    }, interval);

    this.processDueRules();
  }

  /**
   * Stop triggering
   * @returns 
   */
  stop() {
    if (!this.intervalId) return;
    this.isProcessing = false;
    clearInterval(this.intervalId);
  }

  /**
   * Process all due rules if its not running
   * @returns 
   */
  async processDueRules() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    logger.info("Processing invoice automation rules");

    try {
      let cursor: number | undefined = undefined;
      let batchSize = 20;

      while (true) {
        const rules = await this.invoiceAutomationsService.fetchDueRules(cursor, batchSize);
        if (rules.length === 0) break;

        await this.processBatch(rules);
      }

      logger.info("Finished processing all automation rules");
    } catch (e) {
      logger.error("Error processing invoice automation rules");
    } finally {
      this.isProcessing = false;
    }
  }
  /**
   * Process batch of invoice automation rules
   * It generate invoices
   * @param rules Invoice automation rules
   */
  async processBatch(rules: SelectInvoiceAutomationRule[]) {
    logger.info(`Processing batch of ${rules.length} rules`);

    for await (const rule of rules) {
      try {
        if (!rule.project.clientId) continue;

        const items = await this.constructInvoiceItems(rule);

        const dueDate = new Date();
        dueDate.setHours(0, 0, 0, 0);
        dueDate.setDate(dueDate.getDate() + rule.dueDays);

        await this.invoiceService.create(rule.userId, {
          clientId: rule.project.clientId,
          currency: rule.currency,
          language: rule.language,
          dueDate: dueDate,
          items,
          projectId: rule.projectId,
          automationRuleId: rule.id,
        });

      } finally {
        const nextRunDate = this.invoiceAutomationsService.calculateNextRunDate({
          dayOfMonth: rule.dayOfMonth,
          interval: rule.interval,
          nextRunDate: new Date(),
          recurrenceType: rule.recurrenceType
        });

        // Update next run date
        await db.update(invoiceAutomationRules).set({ nextRunDate }).where(eq(invoiceAutomationRules.id, rule.id));
      }
    }
  }
  async constructInvoiceItems(rule: SelectInvoiceAutomationRule): Promise<InvoiceCreateType["items"]> {

    if (rule.allTasks) {
      const entries = await this.timeEntriesService.findByUserId(rule.userId, { projectId: rule.projectId });

      return entries.map(e => {
        const { text } = this.getTimeData(rule.language, e.startAt!, e.endAt!);

        return {
          name: `${e.title ?? e.project?.title} (${text})`,
          qty: 1,
          unitPrice: 100,
          timeEntryId: e.id
        }
      });
    }

    const timeEntryIds = rule.projectTasks.map(e => e.id);
    const entries = await db.query.timeEntries.findMany({
      where: and(
        inArray(timeEntries.id, timeEntryIds),
        eq(timeEntries.userId, rule.userId)
      ),
    });

    return entries.map(e => {
      const { text } = this.getTimeData(rule.language, e.startAt!, e.endAt!);
      return {
        name: `${e.title ?? rule.project.title} (${text})`,
        qty: 1,
        unitPrice: 100,
        timeEntryId: e.id
      }
    });
  }

  getTimeData(locale: string, start: Date, end: Date) {
    const diff = end.getTime() - start.getTime();
    const dateFormat = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "numeric", year: "numeric" });

    return {
      text: dateFormat.format(new Date(diff)),
      diff
    }
  }
}