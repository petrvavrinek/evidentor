"use client";

import { Project } from "@/lib/api/types.gen";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProjectsOverviewLoading from "./projects-overview-loading";
import ProjectsOverviewError from "./projects-overview-error";
import ProjectTableRow from "./project-table-row";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface ProjectsOverviewProps {
  projects: Project[];
  isLoading: boolean;
  error: unknown;
}

export default function ProjectsOverview({ projects, isLoading, error }: ProjectsOverviewProps) {
  if (isLoading) return <ProjectsOverviewLoading />;
  if (error) return <ProjectsOverviewError error={error} />;

  return (
    <Card>
      <CardHeader className="px-6">
        <CardTitle>Project List</CardTitle>
        <CardDescription>{projects.length} project{projects.length !== 1 ? 's' : ''} found</CardDescription>
      </CardHeader>
                              <CardContent className="px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                <TableHead className="hidden lg:table-cell">Progress</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <ProjectTableRow key={project.id} project={project} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
