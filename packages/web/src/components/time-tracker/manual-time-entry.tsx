"use client";

import { cn } from "@/lib/utils";
import { Project } from "@/schemas/project.schema";
import { Task } from "@/schemas/task.schema";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { TimeInput } from "../time-input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import ProjectTaskSelect from "./project-task-select";

interface ManualTimeEntryProps {
  loadProjects: () => Promise<Project[]>;
  loadTasks: (project: Project) => Promise<Task[]>;
}

export default function ManualTimeEntry(props: ManualTimeEntryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const today = new Date();
  today.setSeconds(0, 0); // Reset seconds and milliseconds

  const [date, setDate] = useState(today);

  const canAddTimeEntry = useMemo(
    () => selectedProject && selectedTask,
    [selectedProject, selectedTask]
  );

  const onProjectTaskSelect = (project: Project, task: Task) => {
    setSelectedProject(project);
    setSelectedTask(task);
  };

  return (
    <form onSubmit={() => console.log("Submit")} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <TimeInput
            value={{ hours: 0, minutes: 0 }}
            onChange={(e) => console.log(e)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <TimeInput
            value={{ hours: 1, minutes: 30 }}
            onChange={(e) => console.log(e)}
          />
        </div>
      </div>

      <ProjectTaskSelect
        loadProjects={props.loadProjects}
        loadTasks={props.loadTasks}
        onSelect={onProjectTaskSelect}
      />

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Describe what you worked on" />
      </div>

      <Button type="submit" className="w-full" disabled={!canAddTimeEntry}>
        <Clock className="mr-2 h-4 w-4" />
        Add Time Entry
      </Button>
    </form>
  );
}
