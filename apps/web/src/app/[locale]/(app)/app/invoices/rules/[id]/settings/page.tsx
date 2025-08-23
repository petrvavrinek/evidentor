"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { notFound, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import InvoiceRulesForm, { CreateRuleData } from "@/components/invoices/invoice-rules-form";
import PageHeader from "@/components/page-header";
import { getInvoiceAutomationsByIdOptions, patchInvoiceAutomationsByIdMutation } from "@/lib/api/@tanstack/react-query.gen";
import { Button } from "@evidentor/ui/components/ui/button";

export default function UpdateInvoiceRule() {
  const router = useRouter();
  const { id } = useParams();

  if (!id) return notFound();

  const invoiceAutomationMutation = useMutation({
    ...patchInvoiceAutomationsByIdMutation(),
    onSuccess: () => {
      toast.info("Invoice rule set");
      router.push("..");
    }
  });
  const { data, isLoading } = useQuery(getInvoiceAutomationsByIdOptions({ path: { id: Number.parseInt(id as string) } }));
  if (isLoading) return <>Loading...</>;
  if (!data) return notFound();

  const handleSubmit = (values: CreateRuleData) => {
    invoiceAutomationMutation.mutate({
      body: values,
      path: {
        id: data.id
      }
    });
  }

  return (
    <>
      <PageHeader title={`Update rule: ${data.id}`} controls={(
        <>
          <Button>Reset values</Button>
          <Button variant="destructive" onClick={() => router.back()}>Cancel</Button>
        </>
      )} />
      <InvoiceRulesForm initialData={{
        ...data,
        projectTaskIds: data.projectTasks.map(e => e.id)
      }} onSubmit={handleSubmit} />
    </>
  )

}