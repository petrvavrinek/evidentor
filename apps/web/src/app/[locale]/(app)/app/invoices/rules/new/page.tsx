"use client";

import InvoiceRulesForm, { CreateRuleData } from "@/components/invoices/invoice-rules-form";
import PageHeader from "@/components/page-header";
import { postInvoiceAutomationsMutation } from "@/lib/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function NewInvoiceRules() {
  const router = useRouter();
  const createInvoiceRuleMutation = useMutation({
    ...postInvoiceAutomationsMutation(),
    onSuccess: e => {
      router.push(`/app/invoices/rules/${e.id}`);
    }
  });
  const handleSubmit = (values: CreateRuleData) => {
    createInvoiceRuleMutation.mutate({ body: values });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Create new invoice automation rule" />
      <InvoiceRulesForm onSubmit={handleSubmit} />
    </div>
  )
}