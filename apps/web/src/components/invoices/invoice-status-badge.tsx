import { Invoice } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@evidentor/ui/components/ui/badge";

interface InvoiceStatusBadgeProps {
  status: Invoice["status"],
  className?: string
}

const getStatusColor = (status: Invoice["status"]) => {
  const colors = {
    DRAFT: "bg-gray-100 text-gray-800",
    SENT: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  }
  return colors[status] || colors.DRAFT
}

export default function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const cName = cn(className, "select-none", getStatusColor(status));
  return <Badge variant="secondary" className={cName}>{status}</Badge>;
}