import PageHeader from "@/components/page-header";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

export default function InvoicesPage() {
  return (
    <>
      <PageHeader title="Invoices" subtitle="Manage your invoices" />

      <div className="flex flex-col md:flex-row gap-4 my-5">
        <SearchInput
          placeholder="Search invoices..."
          className="pl-8 w-full"
          containerClassName="flex-1"
        />
      </div>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>1 invoice found</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Project
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Issue date
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Due date
                  </TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">0001</TableCell>
                  <TableCell>Client name</TableCell>
                  <TableCell className="hidden md:table-cell">
                    Project name
                  </TableCell>
                  <TableCell className="hidden md:table-cell">date</TableCell>
                  <TableCell className="hidden md:table-cell">date</TableCell>
                  <TableCell>1000 Kč</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
