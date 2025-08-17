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
import { useNumberFormatter } from "@/hooks/use-number-formatter";
import { useDateFormatter } from "@/hooks/use-date-formatter";

interface InvoiceTableRowProps {
  invoice: Invoice;
  onDelete: () => void;
  onViewDetails: () => void;
}

export function InvoiceTableRow({ invoice, onDelete, onViewDetails }: InvoiceTableRowProps) {
  const dateFormatter = useDateFormatter({ day: "2-digit", month: "2-digit", year: "numeric" });
  const numberFormatter = useNumberFormatter({ currency: invoice.currency.toUpperCase(), style: "currency" });

  // Status: Paid if paidAt is set
  const status = invoice.paidAt ? "Paid" : "Unpaid";

  return (
    <TableRow key={invoice.id}>
      <TableCell className="font-medium">{invoice.id.toString().padStart(4, "0")}</TableCell>
      <TableCell>{invoice.client?.companyName || "-"}</TableCell>
      <TableCell className="hidden md:table-cell">-</TableCell>
      <TableCell className="hidden md:table-cell">{dateFormatter.format(new Date(invoice.issuedAt as string))}</TableCell>
      <TableCell className="hidden md:table-cell">{dateFormatter.format(new Date(invoice.dueDate as string))}</TableCell>
      <TableCell>{numberFormatter.format(invoice.amount)}</TableCell>
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
            <DropdownMenuItem onClick={() => { }}>Edit</DropdownMenuItem>
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

