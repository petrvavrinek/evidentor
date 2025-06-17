"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

import { ClientForm } from "@/components/clients/client-form";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getClient } from "@/lib/api";
import {
  deleteClientByIdMutation,
  getClientQueryKey,
  postClientMutation,
} from "@/lib/api/@tanstack/react-query.gen";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    data: { data: clients },
    isLoading,
    refetch,
  } = useQuery({
    initialData: [] as never,
    queryKey: getClientQueryKey(),
    queryFn: () => getClient(),
  });

  const createClientMutation = useMutation({
    ...postClientMutation(),
    onSuccess: (data, variables, context) => {
      refetch();
    },
  });

  const deleteClientMutation = useMutation({
    ...deleteClientByIdMutation(),
    onSuccess: (data) => {
      refetch();
    },
  });

  if (isLoading || !clients) return <>Loading...</>;

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle="Manage your client relationships"
        controls={
          <Dialog open={false} onOpenChange={() => {}}>
            <DialogTrigger asChild>
              <Button
                className="mt-4 md:mt-0"
                onClick={() => setIsCreateDialogOpen(true)}
              >
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
        }
      />

      <div className="flex flex-col md:flex-row gap-4 my-5">
        <SearchInput
          placeholder="Search clients..."
          className="pl-8 w-full"
          containerClassName="flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Client List</CardTitle>
          <CardDescription>
            {clients.length} {clients.length === 1 ? "client" : "clients"} found
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
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No clients found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.companyName}
                      </TableCell>
                      <TableCell>{client.contactName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.email ? <>{client.email}</> : "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        phone
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
                              onClick={() => {
                                deleteClientMutation.mutateAsync({
                                  path: { id: client.id },
                                });
                              }}
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new client</DialogTitle>
          </DialogHeader>

          <ClientForm
            onCancel={() => setIsCreateDialogOpen(false)}
            onSubmit={(e) => {
              createClientMutation.mutate(
                {
                  body: {
                    companyName: e.contactName,
                    contactName: e.contactName,
                  },
                },
                { onSuccess: () => setIsCreateDialogOpen(false) }
              );
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
