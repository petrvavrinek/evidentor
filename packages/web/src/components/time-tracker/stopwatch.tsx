"use client";

import { formatTime } from "@/lib/format-time";
import { Pause, Play, StopCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

import { Project } from "@/schemas/project.schema";
import { Task } from "@/schemas/task.schema";
import ProjectTaskSelect from "./project-task-select";

interface StopwatchProps {
  loadProjects: () => Promise<Project[]>;
  loadTasks: (project: Project) => Promise<Task[]>;
}

export default function Stopwatch(props: StopwatchProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const canStartTimer = useMemo(
    () => selectedProject && selectedTask,
    [selectedProject, selectedTask]
  );

  const onProjectTaskSelect = (project: Project, task: Task) => {
    setSelectedProject(project);
    setSelectedTask(task);
  };

  return (
    <div className="space-y-4">
      <ProjectTaskSelect
        disabled={isRunning || isPaused}
        loadProjects={props.loadProjects}
        loadTasks={props.loadTasks}
        onSelect={onProjectTaskSelect}
      />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="What are you working on?" />
      </div>

      <Card className="bg-muted/50 border-0">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="text-4xl font-mono font-bold mb-4">
            {formatTime(0)}
          </div>
          <div className="flex gap-2">
            {!isRunning && !isPaused && (
              <Button disabled={!canStartTimer} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Work
              </Button>
            )}
            {isRunning && (
              <Button variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            {isPaused && (
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            {(isRunning || isPaused) && (
              <Button variant="destructive">
                <StopCircle className="h-4 w-4 mr-2" />
                End Work
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
