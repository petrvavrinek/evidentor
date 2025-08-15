import { MoreHorizontal } from "lucide-react";

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

import type { Client } from "@/lib/api";

interface ClientTableRowProps {
	client: Client;
	onDelete: (id: number) => void;
	onDetail?: () => void;
}

export function ClientTableRow({ client, onDelete, onDetail }: ClientTableRowProps) {
	return (
		<TableRow key={client.id}>
			<TableCell className="font-medium">{client.companyName}</TableCell>
			<TableCell>{client.contactName}</TableCell>
			<TableCell className="hidden md:table-cell">
				{client.email ? client.email : "-"}
			</TableCell>
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
						<DropdownMenuItem onClick={onDetail}>View Details</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => onDelete(client.id)}
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
