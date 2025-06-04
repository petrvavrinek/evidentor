"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

// Sample client data
const initialClients = [
  {
    id: "1",
    name: "Acme Inc",
    contactName: "John Smith",
    email: "john@acmeinc.com",
    phone: "(555) 123-4567",
    address: "123 Business Ave, New York, NY 10001",
    tags: ["regular"],
    projects: [
      {
        id: "p1",
        name: "Website Redesign",
        status: "In Progress",
        date: "2025-04-15",
      },
      {
        id: "p2",
        name: "SEO Optimization",
        status: "Completed",
        date: "2025-03-10",
      },
    ],
    invoices: [
      { id: "i1", amount: 5000, status: "Paid", date: "2025-03-15" },
      { id: "i2", amount: 3500, status: "Pending", date: "2025-04-20" },
    ],
  },
  {
    id: "2",
    name: "TechStart",
    contactName: "Sarah Johnson",
    email: "sarah@techstart.io",
    phone: "(555) 987-6543",
    address: "456 Innovation Blvd, San Francisco, CA 94107",
    tags: ["vip"],
    projects: [
      {
        id: "p3",
        name: "Mobile App Development",
        status: "In Progress",
        date: "2025-04-01",
      },
      {
        id: "p4",
        name: "Cloud Migration",
        status: "Planning",
        date: "2025-05-01",
      },
    ],
    invoices: [
      { id: "i3", amount: 12000, status: "Paid", date: "2025-03-30" },
      { id: "i4", amount: 8000, status: "Pending", date: "2025-05-15" },
    ],
  },
  {
    id: "3",
    name: "GreenGrow",
    contactName: "Michael Chen",
    email: "michael@greengrow.com",
    phone: "(555) 456-7890",
    address: "789 Eco Street, Portland, OR 97201",
    tags: ["regular"],
    projects: [
      {
        id: "p5",
        name: "Brand Identity",
        status: "In Progress",
        date: "2025-04-10",
      },
    ],
    invoices: [{ id: "i5", amount: 4500, status: "Paid", date: "2025-04-05" }],
  },
  {
    id: "4",
    name: "ShopEasy",
    contactName: "Lisa Brown",
    email: "lisa@shopeasy.com",
    phone: "(555) 789-0123",
    address: "321 Commerce Road, Chicago, IL 60607",
    tags: ["risky"],
    projects: [
      {
        id: "p6",
        name: "E-commerce Platform",
        status: "In Progress",
        date: "2025-03-20",
      },
    ],
    invoices: [
      { id: "i6", amount: 7500, status: "Overdue", date: "2025-03-25" },
      { id: "i7", amount: 2500, status: "Overdue", date: "2025-04-10" },
    ],
  },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  return (
    <div className="flex-1 p-4 md:p-6 md:ml-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships
          </p>
        </div>
        <Dialog open={false} onOpenChange={() => {}}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details for the new client.
              </DialogDescription>
            </DialogHeader>
            {/* <ClientForm onSubmit={handleAddClient} onCancel={() => setIsAddDialogOpen(false)} /> */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 my-5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            {initialClients.length}{" "}
            {initialClients.length === 1 ? "client" : "clients"} found
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No clients found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  initialClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.contactName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.email}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.phone}
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
                            <DropdownMenuItem onClick={() => {}}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {}}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return <div>Clients</div>;
}
