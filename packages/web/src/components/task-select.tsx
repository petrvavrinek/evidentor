"use client";

import { useLoad } from "@/hooks/use-load";
import { Task } from "@/schemas/task.schema";
import { Key, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";

interface TaskSelectProps {
  /**
   * Function that will retrieve tasks
   * @returns
   */
  load: () => Promise<Task[]>;
  /**
   * Called on task selected
   * @param task Task
   * @returns
   */
  onSelect?: (task: Task) => void;
  /**
   * Should be select disabled?
   */
  disabled?: boolean;
  /**
   * Select ID for Label usage
   */
  id?: string;
}

/**
 * Components that allows dynamically load tasks
 * @param props Component props
 * @returns
 */
export default function TaskSelect(props: TaskSelectProps) {
  const { data, loading } = useLoad(props.load, []);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (selectedTaskIdx !== undefined && data)
      props.onSelect?.(data[selectedTaskIdx]);
  }, [selectedTaskIdx]);

  if (loading) return <Skeleton className="rounded-md w-full h-[32px]" />;

  return (
    <Select
      value={selectedTaskIdx !== undefined ? `${selectedTaskIdx}` : ""}
      disabled={props.disabled || loading}
      onValueChange={(e) => setSelectedTaskIdx(Number.parseInt(e))}
    >
      <SelectTrigger id={props.id ?? "task"} className="w-full">
        <SelectValue placeholder="Select a task" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((e, i) => (
          <SelectItem key={e.id} value={`${i}`}>
            {e.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
