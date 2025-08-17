"use client";

import PageHeader from "@/components/page-header";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import useTitle from "@/hooks/use-title";
import { getInvoicesById, GetInvoicesByIdData, Invoice } from "@/lib/api";
import { getInvoicesByIdQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Alert, AlertDescription, AlertTitle } from "@evidentor/ui/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@evidentor/ui/components/ui/table";
import InvoiceItemTableRow from "@/components/invoices/invoice-item-table-row";
import { TypographyH3 } from "@evidentor/ui/components/ui/typography";

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
  return (
    <>
      <p><span className="font-semibold">Invoice ID:</span> {invoice.id}</p>
      <p><span className="font-semibold">Issued at:</span> {dateFormatter.format(new Date(invoice.issuedAt as string))}</p>
      <p><span className="font-semibold">Created at:</span> {dateFormatter.format(new Date(invoice.createdAt as string))}</p>
      <p><span className="font-semibold">Paid at:</span> {invoice.paidAt ? dateFormatter.format(new Date(invoice.createdAt as string)) : "-"}</p>
      <p><span className="font-semibold">Currency:</span> {invoice.currency}</p>
      <p><span className="font-semibold">Number of items:</span> {invoice.items.length}</p>
    </>
  )
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  if (!params.id)
    return notFound();

  const { data: invoice, isLoading } = useQuery({
    initialData: null,
    queryKey: getInvoicesByIdQueryKey({ path: { id } }),
    queryFn: () => getInvoicesById({ path: { id } })
  });

  useTitle(invoice?.data?.id ? "Loading" : `Invoice: ${invoice?.data?.id}`, [isLoading]);

  if (!invoice?.data || isLoading) return <>Loading..</>;


  const { data: invoiceData } = invoice;
  const { client, project, items, currency } = invoiceData;

  return (
    <>
      <PageHeader
        title="Invoice detail"
        subtitle={`Invoice: ${invoiceData.id}`}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice details</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceDetails {...invoiceData} />
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
      <div className="grid grid-cols-3 mt-4">
        <div className="rounded-md border col-span-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="">
                <TableHead>Title</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-fit">Time entry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                items.map(e => <InvoiceItemTableRow item={e} key={e.id} currency={currency} />)
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </>

  )



}