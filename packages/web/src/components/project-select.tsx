"use client";

import { Project } from "@/schemas/project.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLoad } from "@/hooks/use-load";
import { Skeleton } from "./ui/skeleton";
import { Key, useEffect, useState } from "react";

interface ProjectSelectProps {
  /**
   * Ref should be defined, otherwise it can lead to invalid project idices
   */
  ref?: Key;
  /**
   * Function that will retrieve projects
   * @returns
   */
  load: () => Promise<Project[]>;
  /**
   * Called on project select
   * @param project Selected project
   * @returns
   */
  onSelect?: (project: Project) => void;
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
 * Component that allows to dynamically load projects
 * @param props Component props
 * @returns
 */
export const ProjectSelect = (props: ProjectSelectProps) => {
  const { data, loading } = useLoad(props.load, [props.ref]);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (selectedProjectIdx !== undefined && data)
      props.onSelect?.(data[selectedProjectIdx]);
  }, [selectedProjectIdx]);

  if (loading) return <Skeleton className="rounded-md w-full h-[36px]" />;

  return (
    <Select
      value={
        selectedProjectIdx !== undefined ? `${selectedProjectIdx}` : ""
      }
      disabled={props.disabled || loading}
      onValueChange={(e) => setSelectedProjectIdx(Number.parseInt(e))}
    >
      <SelectTrigger id={props.id ?? "project"} className="w-full h-[36px]">
        <SelectValue placeholder="Select a project" />
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
};
