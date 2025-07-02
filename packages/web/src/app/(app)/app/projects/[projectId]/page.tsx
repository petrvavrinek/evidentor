"use client";

import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { getProjectTaskOptions } from "@/lib/api/@tanstack/react-query.gen";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/page-header";

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectId = Number(params.projectId);

  const { data: tasks, isLoading, error } = useQuery(getProjectTaskOptions());

  // Filter tasks for this project
  const projectTasks = (tasks ?? []).filter(
    (task) => task.project?.id === projectId
  );

  return (
    <div className="space-y-6">
      <PageHeader title={`Project #${projectId} Overview`} />
      <Card>
        <CardHeader>
          <CardTitle>Project Tasks</CardTitle>
        </CardHeader>
        <CardContent>
  {isLoading && <div>Loading tasks...</div>}
  {error && <div className="text-red-500">Failed to load tasks.</div>}
  {!isLoading && !error && projectTasks?.length === 0 && (
    <div>No tasks found for this project.</div>
  )}
  {!isLoading && !error && projectTasks?.length > 0 && (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="px-4 py-2 text-left font-semibold">Title</th>
            <th className="px-4 py-2 text-left font-semibold">Description</th>
            <th className="px-4 py-2 text-left font-semibold">Created At</th>
          </tr>
        </thead>
        <tbody>
          {projectTasks.map((task) => (
            <tr key={task.id} className="border-b hover:bg-muted/50">
              <td className="px-4 py-2 font-medium">{task.title}</td>
              <td className="px-4 py-2">{task.description || <span className="text-muted-foreground">No description</span>}</td>
              <td className="px-4 py-2">{task.createdAt ? new Date(task.createdAt as string).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</CardContent>
      </Card>
    </div>
  );
}
