import { Project } from "@/schemas/project.schema";
import { Task } from "@/schemas/task.schema";
import { useCallback, useState } from "react";
import { ProjectSelect } from "../project-select";
import TaskSelect from "../task-select";
import { Label } from "../ui/label";

interface ProjectTaskSelectProps {
  loadProjects: () => Promise<Project[]>;
  loadTasks: (project: Project) => Promise<Task[]>;
  onSelect?: (project: Project, task: Task) => void;
  disabled?: boolean;
}

export default function ProjectTaskSelect(props: ProjectTaskSelectProps) {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const loadTasks = useCallback(() => {
    if (selectedProject) {
      return props.loadTasks(selectedProject);
    }
    return Promise.resolve([]);
  }, [selectedProject, props.loadTasks]);

  const onTaskSelect = (task: Task) => {
    if (selectedProject && task) props.onSelect?.(selectedProject, task);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <ProjectSelect
          id="project"
          disabled={props.disabled}
          load={props.loadProjects}
          onSelect={(project) => {
            setSelectedProject(project);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task">Task</Label>
        <TaskSelect
          disabled={props.disabled || !selectedProject}
          key={selectedProject?.id}
          id="task"
          load={loadTasks}
          onSelect={onTaskSelect}
        />
      </div>
    </>
  );
}
