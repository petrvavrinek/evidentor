import { z } from "zod";

export const EventSchema = z.object({
  id: z.number(),
  title: z.string(),
  dateFrom: z.coerce.date(),
  dateTo: z.coerce.date().optional().nullable(),
  note: z.string().default(""),
});

export type Event = z.infer<typeof EventSchema>;