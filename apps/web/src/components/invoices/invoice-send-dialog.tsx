import { Invoice } from "@/lib/api";
import { Badge } from "@evidentor/ui/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@evidentor/ui/components/ui/dialog";
import { Separator } from "@evidentor/ui/components/ui/separator";
import { Building2, Calendar, DollarSign, Mail } from "lucide-react";
import InvoiceStatusBadge from "./invoice-status-badge";
import { useNumberFormatter } from "@/hooks/use-number-formatter";
import { useDateFormatter } from "@/hooks/use-date-formatter";
import { Button } from "@evidentor/ui/components/ui/button";

interface InvoiceSendDialogProps {
  invoice: Invoice,
  open: boolean,
  onOpenChange: (newOpen: boolean) => void;
  onConfirm?: () => void
  isLoading?: boolean
}

export default function InvoiceSendDialog({ invoice, onOpenChange, open, isLoading, onConfirm }: InvoiceSendDialogProps) {
  // No generated file id
  if (!invoice.generatedFileId) return;
  const currencyFormatter = useNumberFormatter({ currency: invoice.currency, style: "currency" });
  const dateFormatter = useDateFormatter({ month: "numeric", day: "numeric", year: "numeric" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invoice to Client
          </DialogTitle>
          <DialogDescription>
            Confirm sending invoice #{invoice.textId} to the client's email address.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Invoice ID</span>
              <span className="text-sm text-muted-foreground">#{invoice.textId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Amount
              </span>
              <span className="text-sm font-semibold">{currencyFormatter.format(invoice.amount)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Due Date
              </span>
              <span className="text-sm text-muted-foreground">{dateFormatter.format(new Date(invoice.dueDate as string))}</span>
            </div>
          </div>

          <Separator />

          {/* Client Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Client Information
            </h4>

            {invoice.client ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">{invoice.client.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span>{invoice.client.contactName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-blue-600">{invoice.client.email || "No email provided"}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No client information available</p>
            )}
          </div>

          {!invoice.client?.email && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ No email address found for this client. Please update the client's contact information.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading || !invoice.client?.email} className="min-w-[100px]">
            {isLoading ? "Sending..." : "Send Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}