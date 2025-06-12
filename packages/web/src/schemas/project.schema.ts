import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string()
});

export type Project = z.infer<typeof ProjectSchema>;