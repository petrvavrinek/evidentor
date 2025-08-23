"use client";

import CurrencyInput from "@/components/currency-input";
import LocaleInput from "@/components/locale-input";
import PageHeader from "@/components/page-header";
import { ProjectSelect } from "@/components/project-select";
import QueryDataTable from "@/components/query-data-table";
import { getProjectTasks, ProjectTask } from "@/lib/api";
import { getProjectTasksQueryKey, postInvoiceAutomationsMutation } from "@/lib/api/@tanstack/react-query.gen";
import { zPostInvoiceAutomationsData } from "@/lib/api/zod.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@evidentor/ui/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const CreateRuleSchema = zPostInvoiceAutomationsData.shape.body;
type CreateRuleData = z.infer<typeof CreateRuleSchema>;

export default function NewInvoiceRules() {
  const router = useRouter();
  const createInvoiceRuleMutation = useMutation({
    ...postInvoiceAutomationsMutation(),
    onSuccess: e => {
      router.push(`/app/invoices/rules/${e.id}`);
    }
  });

  const form = useForm({
    resolver: zodResolver(CreateRuleSchema),
    shouldFocusError: true,
    defaultValues: {
      isActive: true,
      interval: 1,
      recurrenceType: "weekly",
      dueDays: 14,
      language: "cs",
      allTasks: true,
      currency: "czk"
    },
  })

  const [includeAllTasks, projectId] = useWatch({
    control: form.control,
    name: ["allTasks", "projectId"]
  });

  const columns: ColumnDef<Omit<ProjectTask, "project">>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 80
    },
    {
      accessorKey: "title",
      header: "Title"
    }
  ]

  const handleSubmit = (values: CreateRuleData) => {
    createInvoiceRuleMutation.mutate({ body: values });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Create new invoice automation rule" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <ProjectSelect onSelect={e => field.onChange(e.id)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <LocaleInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <CurrencyInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrenceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reccurence</FormLabel>
                <FormControl>
                  <ToggleGroup type="single" variant="outline" onValueChange={e => field.onChange(e)} value={field.value}>
                    <ToggleGroupItem value="daily" className="px-2">
                      Daily
                    </ToggleGroupItem>
                    <ToggleGroupItem value="weekly" className="px-4">
                      Weekly
                    </ToggleGroupItem>
                    <ToggleGroupItem value="monthly" className="px-4">
                      Monthly
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due days</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active by default</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={e => field.onChange(e)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allTasks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Include all tasks</FormLabel>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={e => field.onChange(e)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />



          {
            (!includeAllTasks && projectId) && (
              <FormField
                control={form.control}
                name="projectTaskIds"
                render={({ field }) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>Select project tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <QueryDataTable
                        selectable
                        getRowId={e => e.id.toString()}
                        onSelectionChange={e => {
                          const taskIds = Object.keys(e).filter(id => e[id]).map(e => Number.parseInt(e));
                          field.onChange(taskIds);
                        }
                        }
                        defaultSelectedRows={field.value?.map(e => e.toString())}
                        columns={columns}
                        pagination={{ pageSize: 16 }}
                        queryFn={getProjectTasks}
                        queryKey={getProjectTasksQueryKey({ query: { project: projectId } })}
                        queryOptions={{ query: { project: projectId } } as never}
                      />
                    </CardContent>
                    <CardFooter>
                      <FormMessage />
                    </CardFooter>
                  </Card>
                )}
              />
            )
          }

          <Button type="submit">Create</Button>
        </form>
      </Form>

    </div>
  )
}