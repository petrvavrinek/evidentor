import { useNumberFormatter } from "@/hooks/use-number-formatter";
import { Invoice } from "@/lib/api";
import { Badge } from "@evidentor/ui/components/ui/badge";
import { TableCell, TableRow } from "@evidentor/ui/components/ui/table";

interface InvoiceItemTableRowProps {
  item: Invoice["items"][number],
  currency: string
}

export default function InvoiceItemTableRow({ item, currency }: InvoiceItemTableRowProps) {
  const numberFormatter = useNumberFormatter({ style: "currency", currency });

  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="font-medium">{item.qty}</TableCell>
      <TableCell className="font-medium">{numberFormatter.format(item.unitPrice)}</TableCell>
      <TableCell className="font-medium">{numberFormatter.format(item.unitPrice * item.qty)}</TableCell>
      <TableCell>
        {
          item.timeEntry && (
            <Badge>{item.timeEntry.title}</Badge>
          )
        }
      </TableCell>
    </TableRow>
  )

}