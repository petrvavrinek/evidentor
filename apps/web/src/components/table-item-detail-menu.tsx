import { Button } from "@evidentor/ui/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@evidentor/ui/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface TableItemDetailMenuProps {
  onDelete?: () => void;
  onEdit?: () => void;
  onDetail?: () => void;
}

export default function TableItemDetailMenu({ onDelete, onDetail, onEdit }: TableItemDetailMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {onDetail && <DropdownMenuItem onClick={onDetail}>Detail</DropdownMenuItem>}
        {onEdit && <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>}
        {
          onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                Delete
              </DropdownMenuItem>
            </>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}