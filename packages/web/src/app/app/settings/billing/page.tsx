import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Star, Trash2 } from "lucide-react";

export default function SettingsBillingPage() {
  return (
    <>
      <PageHeader
        title="Billing settings"
        subtitle="Configure your hourly rates and client-specific pricing"
      />

      <div className="grid grid-cols-3 gap-4">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Default Hourly Rate</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Input id="defaultRate" type="number" min="1" step="0.01" />
              <span className="ml-2">unit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This is the default hourly rate that will be applied to all
              clients unless a custom rate is specified.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-none">
          <CardHeader>
            <CardTitle>Client-Specific Rates</CardTitle>
            <p className="text-sm text-muted-foreground">
              Set custom hourly rates for specific clients. These rates will
              override the default rate when creating invoices.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client</Label>
                <Select>
                  <SelectTrigger id="clientId" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"client1"}>Client name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Hourly Rate (unit)</Label>
                <div className="flex items-center">
                  <Input id="rate" type="number" min="1" step="0.01" />
                  <span className="ml-2">unit</span>
                </div>
              </div>
              <Button type="button">
                <Plus className="h-4 w-4 mr-2" />
                Add Rate
              </Button>
            </div>

            <div className="border rounded-md mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Client name</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">Tag</div>
                    </TableCell>
                    <TableCell>300 unit</TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
