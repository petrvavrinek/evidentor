import { MoreHorizontal } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Client } from "@/lib/api";
import { TableCell, TableRow } from "../ui/table";

import { Button } from "../ui/button";

interface ClientTableRowProps {
	client: Client;
	onDelete: (id: number) => void;
}

export function ClientTableRow({ client, onDelete }: ClientTableRowProps) {
	return (
		<TableRow key={client.id}>
			<TableCell className="font-medium">{client.companyName}</TableCell>
			<TableCell>{client.contactName}</TableCell>
			<TableCell className="hidden md:table-cell">
				{client.email ? client.email : "-"}
			</TableCell>
			<TableCell className="hidden md:table-cell">
				-{/* {client.phone ? client.phone : "-"} */}
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
						<DropdownMenuItem onClick={() => {}}>View Details</DropdownMenuItem>
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
