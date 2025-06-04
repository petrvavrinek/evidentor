"use client";

import TimeEntriesTable from "@/components/time-entries/time-entries-table";
import ManualTimeEntry from "@/components/time-tracker/manual-time-entry";
import Stopwatch from "@/components/time-tracker/stopwatch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/schemas/project.schema";
import { Task } from "@/schemas/task.schema";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";

const loadProjects = async (): Promise<Project[]> => {
  await new Promise((res) => setTimeout(res, 500));
  return [
    { id: 1, title: "Project 1" },
    { id: 2, title: "Project 2" },
  ];
};

const loadTasks = async (project: Project): Promise<Task[]> => {
  await new Promise((res) => setTimeout(res, 500));

  if (project.id == 1) return [{ id: 1, title: "P1 Task", note: "Note" }];

  return [
    { id: 2, title: "P2 Task 1", note: "Note 1" },
    { id: 3, title: "P2 Task 2", note: "Note 2" },
  ];
};

const timeEntries = [
  {
    project: {
      id: 1,
      title: "Project 1",
    },
    task: {
      id: 1,
      title: "Task 1",
      note: "Task note",
    },
  },
];

export default function TimeTrackerPage() {
  const [currentTab, setCurrentTab] = useState("stopwatch");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle>Time Entry</CardTitle>
          <CardDescription>Track your working hours</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={(e) => setCurrentTab(e)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stopwatch">
                <Clock className="h-4 w-4 mr-2" />
                Stopwatch
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Calendar className="h-4 w-4 mr-2" />
                Manual Entry
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch" className="mt-4">
              <Stopwatch loadProjects={loadProjects} loadTasks={loadTasks} />
            </TabsContent>
            <TabsContent value="manual" className="mt-4">
              <ManualTimeEntry
                loadProjects={loadProjects}
                loadTasks={loadTasks}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Recent Time Entries</CardTitle>
          <CardDescription>Your recent tracked time</CardDescription>
        </CardHeader>
        <CardContent>
          <TimeEntriesTable timeEntries={timeEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
