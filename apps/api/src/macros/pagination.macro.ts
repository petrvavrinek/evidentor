import type { TObject, TProperties } from "@sinclair/typebox";
import { getSchemaValidator, t } from "elysia";

import Elysia from "elysia";
import { PaginationSchema, type Pagination } from "../schemas/pagination.schema";

const validator = getSchemaValidator(PaginationSchema);

interface PaginationProps {
  defaultPageSize: number;
}

export const pagination = new Elysia()
  .macro({
    paginate: (props: PaginationProps) => ({
      resolve: async ({ query }) => {
        const value = validator.Decode(query);
        return {
          pagination: <Pagination>{
            take: value.take,
            skip: value.skip ?? props.defaultPageSize
          }
        }
      },
    })
  });

export const withPagination = <T extends TProperties = TProperties>(type: TObject<T>) => {
  return t.Object({
    ...PaginationSchema.properties,
    ...type.properties
  })
}