import { getTimeEntries, Project, TimeEntry } from "@/lib/api";
import { getTimeEntriesQueryKey } from "@/lib/api/@tanstack/react-query.gen";
import { Checkbox } from "@evidentor/ui/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@evidentor/ui/components/ui/table";
import { useQuery } from "@tanstack/react-query";

interface InvoiceCreateTimeEntriesProps {
  project?: Project;
  onSelect?: (timeEntry: TimeEntry) => void;
  onUnselect?: (timeEntry: TimeEntry) => void;
  selectedIds?: number[]
}

export default function InvoiceCreateTimeEntries({ project, selectedIds, onSelect, onUnselect }: InvoiceCreateTimeEntriesProps) {
  const { data, isLoading } = useQuery({
    queryKey: getTimeEntriesQueryKey(),
    // TODO: Filtering by project and client, whatever
    queryFn: () => getTimeEntries(),
    enabled: !!project
  });

  return (
    <div className="w-full rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[32px]">#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Project task</TableHead>
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
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}