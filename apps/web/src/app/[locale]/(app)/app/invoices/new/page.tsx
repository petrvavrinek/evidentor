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
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

import DatePicker from "@evidentor/ui/components/ui/date-picker";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import InvoiceCreateTimeEntries from "@/components/invoices/new/invoice-create-time-entries";
import InvoiceCreateManualEntries from "@/components/invoices/new/invoice-create-manual-entries";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@evidentor/ui/components/ui/tooltip";
import useTitle from "@/hooks/use-title";
import { useMutation } from "@tanstack/react-query";
import { postInvoicesMutation } from "@/lib/api/@tanstack/react-query.gen";
import { Card, CardContent } from "@evidentor/ui/components/ui/card";
import { useNumberFormatter } from "@/hooks/use-number-formatter";
import { useRouter } from "@/i18n/navigation";

const InvoiceCreateSchema = zPostInvoicesData.shape.body;
type InvoiceCreate = z.infer<typeof InvoiceCreateSchema>;
type InvoiceItem = InvoiceCreate["items"][number];

export default function NewInvoicePage() {
  const locale = useLocale();
  const router = useRouter();
  const dateFormatter = useDateFormatter({ day: "2-digit", month: "2-digit", year: "2-digit" });


  const [project, setProject] = useState<Project>();
  const [selectedTimeEntries, setSelectedTimeEntries] = useState<TimeEntry[]>([]);
  const [groupByTask, setGroupByTask] = useState(false);

  useTitle("Create new invoice");

  const form = useForm<InvoiceCreate>({
    resolver: zodResolver(InvoiceCreateSchema),
    defaultValues: {
      language: locale as Language,
      currency: "czk",
      items: []
    },
  });

  const { mutateAsync } = useMutation({
    ...postInvoicesMutation(),
    onSuccess: (data) => {
      router.push(`/app/invoices/detail/${data.id}`);
    },
  });

  const [formItemWatch] = useWatch({
    name: ["items"],
    control: form.control
  });
  const [currencyWatch] = useWatch({
    name: ["currency"],
    control: form.control
  });
  const numberFormatter = useNumberFormatter({ currency: currencyWatch, style: "currency" })

  const items = useMemo<InvoiceItem[]>(() => {
    const newItems: InvoiceItem[] = [...formItemWatch];
    for (const timeEntry of selectedTimeEntries) {
      newItems.push({
        name: `${timeEntry.title} ${timeEntry.projectTask?.title ? `(${timeEntry.projectTask.title})` : ""}`,
        qty: 1,
        unitPrice: 100,
        timeEntryId: timeEntry.id
      })
    }

    return newItems;
  }, [selectedTimeEntries, formItemWatch]);
  const total = useMemo<number>(() => items.reduce((prev, c) => prev + c.qty * c.unitPrice, 0), [items]);

  const handleSubmit = async (values: InvoiceCreate) => {
    await mutateAsync({
      body: {
        currency: values.currency,
        dueDate: new Date(values.dueDate as string),
        language: values.language,
        projectId: values.projectId,
        items: items
      }
    });
  }

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
            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
                <InvoiceCreateTimeEntries project={project} onSelect={addSelectedTask} onUnselect={removeSelectedTask} selectedIds={selectedTimeEntries.map(e => e.id)} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormItem className="border rounded-md p-2 flex w-fit">
                      <FormLabel>Group by task</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={groupByTask}
                          onCheckedChange={e => setGroupByTask(e as boolean)}
                        />
                      </FormControl>
                    </FormItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    Invoice will contain only task title with time instead of each time entry.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div>
                <InvoiceCreateManualEntries control={form.control} name="items" />
              </div>
            </div>


            <Card>
              <CardContent>
                Total: {numberFormatter.format(total)}
              </CardContent>
            </Card>
            <Button type="submit" disabled={!form.formState.isValid || items.length === 0}>
              Create invoice
            </Button>

          </div>
        </form>
      </Form>
    </>
  )
}