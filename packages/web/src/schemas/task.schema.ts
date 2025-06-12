import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  note: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
