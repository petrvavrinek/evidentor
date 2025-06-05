"use client";

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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Manage your projects and track progress"
        controls={
          <Dialog open={false} onOpenChange={() => {}}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>
                  Enter the details for new project.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 my-5">
        <SearchInput
          placeholder="Search projects..."
          containerClassName="flex-1"
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Status: All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Planned</DropdownMenuItem>
              <DropdownMenuItem>In Progress</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Priority: All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>High</DropdownMenuItem>
              <DropdownMenuItem>Medium</DropdownMenuItem>
              <DropdownMenuItem>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6">
          <CardTitle>Project List</CardTitle>
          <CardDescription>1 project found</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Priority
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Deadline
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Progress
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Evidentor project</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      Evidentor project description
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    Client name
                  </TableCell>
                  <TableCell className="hidden md:table-cell">Status</TableCell>
                  <TableCell className="hidden md:table-cell">
                    Priority
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    Deadline
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    Progress
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
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
