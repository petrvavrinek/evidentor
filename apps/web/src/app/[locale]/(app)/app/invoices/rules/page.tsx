"use client";

import PageHeader from "@/components/page-header";
import QueryDataTable from "@/components/query-data-table";
import TableItemDetailMenu from "@/components/table-item-detail-menu";
import { getInvoiceAutomations, InvoiceAutomation } from "@/lib/api";
import { getInvoiceAutomationsQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export default function InvoiceRules() {
  const router = useRouter();

  const columns: ColumnDef<InvoiceAutomation>[] = [
    {
      accessorKey: "id",
      header: "ID"
    },
    {
      accessorKey: "project.title",
      header: "Project title"
    },
    {
      accessorKey: "project.client.companyName",
      header: "Client name"
    },
    {
      accessorKey: "recurrenceType",
      header: "Reccurence"
    },
    {
      id: "options",
      cell: ({ row }) => {
        return <TableItemDetailMenu onDetail={() => router.push(row.original.id.toString())} />
      },
      size: 80
    }
  ];


  return (
    <>
      <PageHeader
        title="Invoice automation rules"
        subtitle="Manage automation rules to generate invoices automatically"
        controls={
          <Button
            onClick={() => router.push("new")}
          >Create new</Button>
        }
      />

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Invoice automation rules</CardTitle>
        </CardHeader>
        <CardContent className="px-6">

          <QueryDataTable
            queryFn={getInvoiceAutomations}
            queryKey={getInvoiceAutomationsQueryKey()}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />
        </CardContent>
      </Card>

    </>
  )
}