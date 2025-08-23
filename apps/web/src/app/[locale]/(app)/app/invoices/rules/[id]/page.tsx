"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { notFound, useParams, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

import { DataTable } from "@/components/data-table";
import PageHeader from "@/components/page-header";
import { ProjectTask } from "@/lib/api";
import { getInvoiceAutomationsByIdOptions } from "@/lib/api/@tanstack/react-query.gen";
import { Badge } from "@evidentor/ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { TypographyH3 } from "@evidentor/ui/components/ui/typography";
import { Button } from "@evidentor/ui/components/ui/button";

const DescriptionRow = ({ text, children }: PropsWithChildren<{ text: string }>) => (
  <p><span className="font-semibold">{text}:</span> {children}</p>
)

export default function InvoiceRuleDetail() {
  const router = useRouter();
  const { id } = useParams();

  if (!id) return notFound();

  const { data: rule, isLoading } = useQuery(getInvoiceAutomationsByIdOptions({ path: { id: Number.parseInt(id as string) } }))

  if (isLoading) return <>Loading...</>;
  if (!rule) return notFound();

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

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader title="Invoice automation rule detail" controls={
          <Button onClick={() => router.push(`/app/invoices/rules/${id}/settings`)}>Settings</Button>
        } />

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionRow text="ID">{rule.id}</DescriptionRow>
              <DescriptionRow text="Is active">
                <Badge>{rule.isActive ? "Y" : "N"}</Badge>
              </DescriptionRow>
              <DescriptionRow text="Reccurence">{rule.recurrenceType}</DescriptionRow>
              <DescriptionRow text="Due days">{rule.dueDays}</DescriptionRow>
              <DescriptionRow text="All tasks">
                <Badge>{rule.allTasks ? "Y" : "N"}</Badge>
              </DescriptionRow>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project details</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionRow text="Project title">{rule.project.title}</DescriptionRow>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Client details</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionRow text="Client name">{rule.project.client?.companyName}</DescriptionRow>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project tasks</CardTitle>
            </CardHeader>
            <CardContent>

              {
                rule.allTasks && <>Includes all tasks</>
              }
              {
                !rule.allTasks && (
                  <DataTable data={rule.projectTasks} columns={columns} />
                )
              }
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}