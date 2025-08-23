"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { DataTable } from "@/components/data-table";
import InvoicePdfModal from "@/components/invoices/invoice-pdf-modal";
import PageHeader from "@/components/page-header";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { useNumberFormatter } from "@/hooks/use-number-formatter";
import useTitle from "@/hooks/use-title";
import { getInvoicesById, Invoice } from "@/lib/api";
import { deleteInvoicesByIdMutation, getInvoicesByIdQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Alert, AlertDescription } from "@evidentor/ui/components/ui/alert";
import { Badge } from "@evidentor/ui/components/ui/badge";
import { Button } from "@evidentor/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { TypographyH3 } from "@evidentor/ui/components/ui/typography";

type InvoiceItem = Invoice["items"][number]

const ProjectNotFoundAlert = () => (
  <Alert variant="destructive">
    <AlertDescription>
      <p>Please verify your billing information and try again.</p>
      <ul className="list-inside list-disc text-sm">
        <li>Check your card details</li>
        <li>Ensure sufficient funds</li>
        <li>Verify billing address</li>
      </ul>
    </AlertDescription>
  </Alert>
)
const ClientNotFoundAlert = () => (
  <Alert variant="destructive">
    <AlertDescription>
      <p>Please verify your billing information and try again.</p>
      <ul className="list-inside list-disc text-sm">
        <li>Check your card details</li>
        <li>Ensure sufficient funds</li>
        <li>Verify billing address</li>
      </ul>
    </AlertDescription>
  </Alert>
)

const ProjectDetail = (project: NonNullable<Required<Invoice["project"]>>) => (
  <p><span className="font-semibold">Title:</span> {project.title ?? "N/A"}</p>
)

const ClientDetail = (client: NonNullable<Required<Invoice["client"]>>) => (
  <>
    <p><span className="font-semibold">Company:</span> {client.companyName}</p>
    <p><span className="font-semibold">Contact:</span> {client.contactName}</p>
    <p><span className="font-semibold">Email:</span> {client.email ?? "N/A"}</p>
  </>
)

const InvoiceDetails = (invoice: Invoice) => {
  const dateFormatter = useDateFormatter({ day: "2-digit", month: "2-digit", year: "numeric" });
  const status = invoice.paidAt ? "Paid" : "Unpaid";
  return (
    <>
      <p><span className="font-semibold">Issued at:</span> {dateFormatter.format(new Date(invoice.issuedAt as string))}</p>
      <p><span className="font-semibold">Created at:</span> {dateFormatter.format(new Date(invoice.createdAt as string))}</p>
      <p><span className="font-semibold">Paid at:</span> {invoice.paidAt ? dateFormatter.format(new Date(invoice.createdAt as string)) : "-"}</p>
      <p><span className="font-semibold">Status:</span> {status}</p>
      <p><span className="font-semibold">Currency:</span> {invoice.currency}</p>
      <p><span className="font-semibold">Number of items:</span> {invoice.items.length}</p>
      <p><span className="font-semibold">Language:</span> {invoice.language}</p>
    </>
  )
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  if (!params.id)
    return notFound();

  const [openPdf, setOpenPdf] = useState(false);

  const { data: invoice, isLoading } = useQuery({
    initialData: null,
    queryKey: getInvoicesByIdQueryKey({ path: { id } }),
    queryFn: () => getInvoicesById({ path: { id } })
  });
  const deleteInvoiceMutation = useMutation({
    ...deleteInvoicesByIdMutation(),
    onSuccess: () => router.push("..")
  });

  useTitle(invoice?.id ? "Loading" : `Invoice: ${invoice?.id}`, [isLoading]);

  if (!invoice || isLoading) return <>Loading..</>;

  const { client, project, items, currency } = invoice;
  const currencyFormatter = useNumberFormatter({ currency: invoice.currency, style: "currency" })

  const itemsColumns: ColumnDef<InvoiceItem>[] = [
    {
      accessorKey: "name",
      header: "Title"
    },
    {
      id: "timeEntry",
      header: "Time entry",
      cell: ({ row: { original: item } }) => (
        <>
          {item.timeEntry ? <Badge>{item.timeEntry.title}</Badge> : <X />}
        </>
      )
    },
    {
      accessorKey: "qty",
      header: "Qty"
    },
    {
      accessorKey: "unitPrice",
      header: "Unit price",
      cell: ({ row: { original: item } }) => currencyFormatter.format(item.unitPrice)
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row: { original: item } }) => currencyFormatter.format(item.qty * item.unitPrice)
    }
  ]

  return (
    <>
      <PageHeader
        title="Invoice detail"
        subtitle={`Invoice: ${invoice.textId}`}
        controls={
          <>
            {invoice.generatedFileId && <Button onClick={() => setOpenPdf(true)}>Open PDF</Button>}
            <Button variant="destructive" onClick={() => deleteInvoiceMutation.mutate({ path: { id: invoice.id } })}>
              Delete
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice details</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceDetails {...invoice} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project details</CardTitle>
          </CardHeader>
          <CardContent>
            {!project && <ProjectNotFoundAlert />}
            {project && <ProjectDetail {...project} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Client details</CardTitle>
          </CardHeader>
          <CardContent>
            {!client && <ClientNotFoundAlert />}
            {client && <ClientDetail {...client} />}
          </CardContent>
        </Card>
      </div>

      <TypographyH3 className="my-2">Invoice items</TypographyH3>



      <div className="grid xl:grid-cols-2 grid-cols-1 mt-4">
        <DataTable data={invoice.items} columns={itemsColumns} />
      </div>
      <InvoicePdfModal invoice={invoice} open={openPdf} onOpenChange={setOpenPdf} />
    </>

  )



}