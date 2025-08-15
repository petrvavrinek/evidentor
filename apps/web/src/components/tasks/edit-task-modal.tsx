"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@evidentor/ui/components/ui/dialog";
import { Button } from "@evidentor/ui/components/ui/button";
import { Input } from "@evidentor/ui/components/ui/input";
import { Label } from "@evidentor/ui/components/ui/label";
import { Textarea } from "@evidentor/ui/components/ui/textarea";

import type { ProjectTask } from "@/lib/api";
import { patchProjectTasksByIdMutation } from "@/lib/api/@tanstack/react-query.gen";

interface EditTaskModalProps {
  open: boolean;
  onClose?: () => void;
  task: ProjectTask;
  onUpdate?: (task: ProjectTask) => void;
}

export default function EditTaskModal({
  open,
  onClose,
  task,
  onUpdate,
}: EditTaskModalProps) {
  const updateTask = useMutation({
    ...patchProjectTasksByIdMutation(),
  });

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? "");
  }, [task]);

  const onTaskUpdated = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask
      .mutateAsync({
        path: { id: task.id },
        body: {
          title,
          description,
        },
      })
      .then(() => {
        toast.success("Task updated");
        onUpdate?.({ ...task, title, description });
        onClose?.();
      })
      .catch(() => {
        toast.error("Could not update task");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Edit Task</DialogHeader>
        <form onSubmit={onTaskUpdated} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Website Redesign"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Task Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="..."
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button className="bg-secondary" disabled={updateTask.isPending} onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={updateTask.isPending} className="w-full">
				        {updateTask.isPending ? "Updating..." : "Save"}
			      </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
