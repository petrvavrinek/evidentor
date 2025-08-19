import { useDateFormatter } from "@/hooks/use-date-formatter";
import { getTimeEntries, Project, TimeEntry } from "@/lib/api";
import { getTimeEntriesQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Card, CardContent, CardHeader, CardTitle } from "@evidentor/ui/components/ui/card";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@evidentor/ui/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Box, Package } from "lucide-react";

interface InvoiceCreateTimeEntriesProps {
  project?: Project;
  onSelect?: (timeEntry: TimeEntry) => void;
  onUnselect?: (timeEntry: TimeEntry) => void;
  selectedIds?: number[]
}

export default function InvoiceCreateTimeEntries({ project, selectedIds, onSelect, onUnselect }: InvoiceCreateTimeEntriesProps) {
  const dateFormatter = useDateFormatter({ hour: "numeric", minute: "numeric", second: "numeric" });
  const { data, isLoading } = useQuery({
    queryKey: getTimeEntriesQueryKey(),
    // TODO: Filtering by project and client, whatever
    queryFn: () => getTimeEntries(),
    enabled: !!project
  });

  const diffDate = (start: Date, end: Date) => new Date(end.getTime() - start.getTime());

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-5 w-6" />
            Time entries
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {
          !isLoading && !project && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{data?.data === undefined ? "No project selected" : "No time entries recorded"}</p>
            </div>
          )
        }
        {
          project && data?.data?.length && (
            <div className="w-full rounded-md border">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[32px]">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Project task</TableHead>
                    <TableHead>Tracked time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && "Loading..."}
                  {
                    data?.data?.map(item => (
                      <TableRow key={item.id} data-state={selectedIds?.includes(item.id) ? "selected" : undefined}>
                        <TableCell className="w-[32px]">
                          <Checkbox
                            checked={selectedIds?.includes(item.id) ?? false}
                            onCheckedChange={e => e ? onSelect?.(item) : onUnselect?.(item)}
                          />
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.projectTask?.title ?? "-"}</TableCell>
                        <TableCell>{dateFormatter.format(diffDate(new Date(item.startAt as string), new Date(item.endAt as string)))}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          )
        }
      </CardContent>
    </Card>
  )
}