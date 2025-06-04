"use client";

import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { TimeInput } from "./time-input";
import { Calendar } from "./ui/calendar";

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export default function ManualTimeEntry() {
  const today = new Date();
  today.setSeconds(0, 0); // Reset seconds and milliseconds

  const [date, setDate] = useState(today);

  return (
    <form onSubmit={() => console.log("Submit")} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal"
                // errors.date && "border-destructive"
              )}
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

      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <Select
          value={"project.1"}
          onValueChange={() => console.log("Project change")}
        >
          <SelectTrigger id="project">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"project.1"}>Project 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 
      {selectedProjectId && (
        <div className="space-y-2">
          <Label htmlFor="task">Task</Label>
          <Select
            value={selectedTaskId}
            onValueChange={(value) => {
              setSelectedTaskId(value);
              if (errors.taskId) {
                setErrors({ ...errors, taskId: null });
              }
            }}
          >
            <SelectTrigger
              id="task"
              className={errors.taskId ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select a task" />
            </SelectTrigger>
            <SelectContent>
              {activeTasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.taskId && (
            <p className="text-destructive text-sm">{errors.taskId}</p>
          )}
        </div>
      )} */}

      {/* {selectedClient && (
        <div className="text-sm text-muted-foreground">
          Client: {selectedClient.name}
        </div>
      )} */}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Describe what you worked on" />
      </div>

      <Button type="submit" className="w-full">
        <Clock className="mr-2 h-4 w-4" />
        Add Time Entry
      </Button>
    </form>
  );
}
