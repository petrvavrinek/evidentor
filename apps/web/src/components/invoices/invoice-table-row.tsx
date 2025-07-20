import { MoreHorizontal } from "lucide-react";

import type { Invoice } from "@/lib/api/types.gen";

import { Button } from "@evidentor/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@evidentor/ui/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@evidentor/ui/components/ui/table";

interface InvoiceTableRowProps {
  invoice: Invoice;
  onDelete: () => void;
  onViewDetails: () => void;
}

export function InvoiceTableRow({ invoice, onDelete, onViewDetails }: InvoiceTableRowProps) {
  // Format dates (unknown | null)
  const formatDate = (date: unknown) => {
    if (!date) return "-";
    try {
      const d = new Date(date as string);
      return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    } catch {
      return "-";
    }
  };
  // Format amount with currency using Intl.NumberFormat
  const formatAmount = (amount: number, currency: string) => {
    if (typeof amount !== "number") return "-";
    let code = currency.toUpperCase();
    // Map backend codes to standard ISO codes if needed
    if (code === "CZK") code = "CZK";
    if (code === "EUR") code = "EUR";
    if (code === "USD") code = "USD";
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(amount);
    } catch {
      return `${amount} ${code}`;
    }
  };
  // Status: Paid if paidAt is set
  const status = invoice.paidAt ? "Paid" : "Unpaid";

  return (
    <TableRow key={invoice.id}>
      <TableCell className="font-medium">{invoice.id.toString().padStart(4, "0")}</TableCell>
      <TableCell>{invoice.client?.companyName || "-"}</TableCell>
      <TableCell className="hidden md:table-cell">{invoice.project?.title || "-"}</TableCell>
      <TableCell className="hidden md:table-cell">{formatDate(invoice.issuedAt)}</TableCell>
      <TableCell className="hidden md:table-cell">{formatDate(invoice.dueDate)}</TableCell>
      <TableCell>{formatAmount(invoice.amount, invoice.currency)}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

