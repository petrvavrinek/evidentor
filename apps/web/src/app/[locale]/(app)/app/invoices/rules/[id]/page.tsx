"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import InvoiceStatusBadge from "@/components/invoices/invoice-status-badge";
import PageHeader from "@/components/page-header";
import QueryDataTable from "@/components/query-data-table";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { getInvoices, Invoice, ProjectTask } from "@/lib/api";
import { deleteInvoiceAutomationsByIdMutation, getInvoiceAutomationsByIdOptions, getInvoicesQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Badge } from "@evidentor/ui/components/ui/badge";
import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@evidentor/ui/components/ui/tabs";

const DescriptionRow = ({ text, children }: PropsWithChildren<{ text: string }>) => (
  <p><span className="font-semibold">{text}:</span> {children}</p>
)

export default function InvoiceRuleDetail() {
  const router = useRouter();
  const { id } = useParams();

  if (!id) return notFound();
  
  const dateFormatter = useDateFormatter({ day: "numeric", month: "numeric", year: "numeric" });
  const { data: rule, isLoading } = useQuery(getInvoiceAutomationsByIdOptions({ path: { id: Number.parseInt(id as string) } }))
  const deleteRuleMutation = useMutation({
    ...deleteInvoiceAutomationsByIdMutation(),
    onSuccess: () => {
      toast.info("Invoice rule deleted");
      router.push("..");
    }
  });

  if (isLoading) return <>Loading...</>;
  if (!rule) return notFound();

  const projectTaskColumns: ColumnDef<Omit<ProjectTask, "project">>[] = [
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
  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "textId",
      header: "ID",
      size: 120
    },
    {
      accessorKey: "project.title",
      header: "Project title"
    },
    {
      id: "status",
      cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
      header: "Status"
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => dateFormatter.format(new Date(row.original.createdAt as string))
    },
    {
      id: "options",
      cell: ({ row }) => (
        <Button className="p-0" onClick={() => router.push(`/app/invoices/detail/${row.original.id}`)}>
          <Link className="h-6 w-6" />
        </Button>
      )
    }
  ]

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader title="Invoice automation rule detail" controls={
          <>
            <Button onClick={() => router.push(`/app/invoices/rules/${id}/settings`)}>Settings</Button>
            <Button variant="destructive" onClick={() => deleteRuleMutation.mutate({ path: { id: rule.id } })}>Delete</Button>
          </>
        } />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule</CardTitle>
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
          <Tabs defaultValue="tasks" searchParam="tab">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="invoices">Generated invoices</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <Card>
                <CardContent>
                  {
                    rule.allTasks && <>Includes all tasks</>
                  }
                  {
                    !rule.allTasks && (
                      <DataTable data={rule.projectTasks} columns={projectTaskColumns} />
                    )
                  }
                </CardContent>
              </Card>

            </TabsContent>
            <TabsContent value="invoices">
              <Card>
                <CardContent>
                  <QueryDataTable
                    columns={invoiceColumns}
                    queryFn={getInvoices}
                    queryOptions={{ query: { automationRuleId: rule.id } as never }}
                    queryKey={getInvoicesQueryKey({ query: { automationRuleId: rule.id } })}
                    pagination={{ pageSize: 16 }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}