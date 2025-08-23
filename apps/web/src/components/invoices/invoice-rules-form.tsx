"use client";

import CurrencyInput from "@/components/currency-input";
import LocaleInput from "@/components/locale-input";
import { ProjectSelect } from "@/components/project-select";
import QueryDataTable from "@/components/query-data-table";
import { getProjectTasks, Project, ProjectTask } from "@/lib/api";
import { getProjectTasksQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { zPostInvoiceAutomationsData } from "@/lib/api/zod.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@evidentor/ui/components/ui/form";
import { Input } from "@evidentor/ui/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@evidentor/ui/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@evidentor/ui/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const CreateRuleSchema = zPostInvoiceAutomationsData.shape.body;
export type CreateRuleData = z.infer<typeof CreateRuleSchema>;

interface InvoiceRulesProps {
  initialData?: CreateRuleData,
  onSubmit?: (values: CreateRuleData) => void;
}

export default function InvoiceRulesForm({ initialData, onSubmit }: InvoiceRulesProps) {
  const [project, setProject] = useState<Project>();

  const form = useForm({
    resolver: zodResolver(CreateRuleSchema),
    shouldFocusError: true,
    defaultValues: {
      isActive: true,
      interval: 1,
      recurrenceType: "monthly",
      dueDays: 14,
      language: "cs",
      allTasks: true,
      currency: "czk",
      projectId: project?.id,
      dayOfMonth: 1,
      ...initialData
    },
  })

  const [includeAllTasks, projectId, recurrenceType] = useWatch({
    control: form.control,
    name: ["allTasks", "projectId", "recurrenceType"]
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
    onSubmit?.(values);
  }

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="grid gap-6 md:grid-cols-2" >
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <ProjectSelect onSelect={e => {
                    field.onChange(e.id)
                    setProject(e);
                  }} projectId={field.value} />
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


        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 flex-1">
                  <FormLabel className="h-fit">Language</FormLabel>
                  <FormControl>
                    <LocaleInput {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 flex-1">
                  <FormLabel className="h-fit">Currency</FormLabel>
                  <FormControl>
                    <CurrencyInput {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4">

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
            {
              recurrenceType === "monthly" && (
                <FormField
                  control={form.control}
                  name="dayOfMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of month</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={e => field.onChange(Number.parseInt(e.target.value))} value={field.value ?? 1} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            }
          </div>
        </div>

        <FormField
          control={form.control}
          name="dueDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due days</FormLabel>
              <FormControl>
                <Input {...field} onChange={e => field.onChange(Number.parseInt(e.target.value))} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2">
          <div className="grid grid-cols-2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex">
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
                <FormItem className="flex">
                  <FormLabel>Include all tasks</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={e => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}