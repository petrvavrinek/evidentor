"use client";

import CurrencyInput from "@/components/currency-input";
import LocaleInput from "@/components/locale-input";
import PageHeader from "@/components/page-header";
import { ProjectSelect } from "@/components/project-select";
import ClientSelect from "@/components/projects/client-select";
import { Language } from "@/i18n/routing";
import { Project, ProjectTask, TimeEntry } from "@/lib/api";
import { zPostInvoicesData } from "@/lib/api/zod.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@evidentor/ui/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import DatePicker from "@evidentor/ui/components/ui/date-picker";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import InvoiceCreateTimeEntries from "@/components/invoices/new/invoice-create-time-entries";
import InvoiceCreateManualEntries from "@/components/invoices/new/invoice-create-manual-entries";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@evidentor/ui/components/ui/tooltip";

const InvoiceCreateSchema = zPostInvoicesData.shape.body;
type InvoiceCreate = z.infer<typeof InvoiceCreateSchema>;

export default function NewInvoicePage() {
  const locale = useLocale();
  const [project, setProject] = useState<Project>();
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<TimeEntry[]>([]);

  const form = useForm<InvoiceCreate>({
    resolver: zodResolver(InvoiceCreateSchema),
    defaultValues: {
      language: locale as Language,
      currency: "czk",
      items: []
    }
  });

  const dateFormatter = useDateFormatter({ day: "2-digit", month: "2-digit", year: "2-digit" });

  const handleSubmit = async (values: InvoiceCreate) => { }

  const addSelectedTask = (entry: TimeEntry) => {
    setSelectedTimeEntries(_ => {
      const timeEntry = _.find(e => e.id === entry.id);
      if (timeEntry) return _;
      return [..._, entry];
    });
  }

  const removeSelectedTask = (entry: TimeEntry) => {
    setSelectedTimeEntries(selectedTimeEntries.filter(e => e.id !== entry.id));
  }

  return (
    <>
      <PageHeader title="New invoice" subtitle="Create new invoice" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <ProjectSelect
                      projectId={field.value}
                      onSelect={(project) => {
                        setProject(project);
                        field.onChange(project?.id ?? null)
                      }
                      } />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select disabled >
                <SelectTrigger className="w-full" >
                  <SelectValue placeholder={project?.client?.companyName ?? "Select project"} />
                </SelectTrigger>
              </Select>
            </FormItem>

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        className="w-full"
                        value={field.value ? new Date(field.value as string) : undefined}
                        onChange={field.onChange}
                        formatDate={e => dateFormatter.format(e)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <CurrencyInput {...field} value="CZK" className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <LocaleInput {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <p>Time entries</p>
                <InvoiceCreateTimeEntries project={project} onSelect={addSelectedTask} onUnselect={removeSelectedTask} selectedIds={selectedTimeEntries.map(e => e.id)} />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormItem className="border rounded-md p-2 flex w-fit">
                      <FormLabel>Group by task</FormLabel>
                      <FormControl>
                        <Checkbox />
                      </FormControl>
                    </FormItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    Invoice will contain only task title with time instead of each time entry.
                  </TooltipContent>
                </Tooltip>

              </div>
              <div>
                <InvoiceCreateManualEntries />
              </div>
            </div>

            <Button type="submit" disabled={false}>
              Create invoice
            </Button>

          </div>
        </form>
      </Form>
    </>
  )
}