import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Options, RequestOptions, TDataShape } from "@/lib/api/client";
import { Alert, AlertDescription, AlertTitle } from "@evidentor/ui/components/ui/alert";
import { Button } from "@evidentor/ui/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@evidentor/ui/components/ui/table";

type UnwrapArray<T> = T extends (infer U)[] ? U : T;
type EnsureArray<T> = T extends any[] ? T : T[];

// Extract the data type from a query function
type ExtractQueryData<T> = T extends (options?: Options<infer TData, any> | undefined) => any ? TData : never;

// Extract the response data type from a query function  
type ExtractQueryResponse<T> = T extends (...args: any[]) => Promise<{ data: infer TResponse } | any> ? TResponse : never;

type QueryResponse<TData> = Promise<TData>

interface QueryDataTableProps<
  TQueryFn extends (options?: RequestOptions<any, false>) => QueryResponse<any>,
  TValue,
  TData = ExtractQueryResponse<TQueryFn>,
  TDataSingle = UnwrapArray<TData>,
  TQueryData extends TDataShape = ExtractQueryData<TQueryFn>
> {
  selectable?: boolean;
  columns: ColumnDef<TDataSingle, TValue>[],
  pagination: {
    pageSize: number;
  },
  queryFn: TQueryFn,
  queryKey: any,
  queryOptions?: Options<TQueryData>
}

export default function QueryDataTable<
  TQueryFn extends (options?: Options<any, false>) => QueryResponse<any>,
  TData,
  TValue = any,
  TDataSingle = UnwrapArray<TData>,
  TQueryData extends TDataShape = ExtractQueryData<TQueryFn>
>({ columns, selectable, queryFn, queryKey, queryOptions }: QueryDataTableProps<TQueryFn, TData, TValue, TDataSingle, TQueryData>) {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const paginationLimitOffset = useMemo(() => {
    const { pageSize, pageIndex } = pagination;

    const limit = pageSize;
    const offset = pageIndex * pageSize;

    return { limit, offset };
  }, [pagination]);

  const { data, error, isLoading } = useQuery({
    queryFn: () => {
      const options: Options = {
        ...queryOptions,
        query: {
          ...(queryOptions?.query ?? {}),
          take: paginationLimitOffset.limit,
          skip: paginationLimitOffset.offset
        }
      };
      return queryFn(options as never);
    },
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey]
  });

  const table = useReactTable<TDataSingle>({
    columns: columns as never,
    data: (!isLoading && Array.isArray(data)) ? data : [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination
    },
    enableRowSelection: selectable,
  });

  const setNextPage = () => {
    setPagination(p => {
      return p;
    });
  }
  const setPrevPage = () => {
    setPagination(p => p);
  }

  if (!isLoading && !!data && !Array.isArray(data)) {
    return (
      <Alert variant={"destructive"}>
        <AlertTitle>Wrong type</AlertTitle>
        <AlertDescription>Fetched data must by type of array</AlertDescription>
      </Alert>
    )
  };


  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="p-2.5">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {
            isLoading && <TableRow>
              <TableCell colSpan={columns.length}>Loading...</TableCell>
            </TableRow>
          }
          {
            !isLoading && (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-2.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center p-2.5">
                    No results.
                  </TableCell>
                </TableRow>
              )
            )
          }
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 py-4">
        {
          selectable && (
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )
        }
        <div className="space-x-2 mr-4">
          <Button
            variant="outline"
            size="sm"
            onClick={setPrevPage}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={setNextPage}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )




}