import { z } from "zod";
import { TaskSchema } from "./task.schema";
import { ProjectSchema } from "./project.schema";

export const TaskWithProjectSchema = TaskSchema.extend({
  project: ProjectSchema,
});

export type TaskWithProject = z.infer<typeof TaskWithProjectSchema>;
