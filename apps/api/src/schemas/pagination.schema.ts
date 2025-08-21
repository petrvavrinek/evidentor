import { t, type Static } from "elysia";

export const PaginationSchema = t.Object({
  take: t.Optional(t.Number()),
  skip: t.Optional(t.Number())
}, { additionalProperties: true });

export type PaginationInput = Static<typeof PaginationSchema>;

export type Pagination = {
  take?: number;
  skip: number
}