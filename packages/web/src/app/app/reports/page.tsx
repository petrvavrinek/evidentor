import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";
import { Clock, Calendar, BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Analyze your work patterns and productivity"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20 h</div>
            <p className="text-xs text-muted-foreground">
              1 time entry in february 2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20 h</div>
            <p className="text-xs text-muted-foreground">
              Across 7 active days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Most Active Client
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Client name</div>
            <p className="text-xs text-muted-foreground">19 h logged</p>
          </CardContent>
        </Card>
      </div>

      <TypographyH3>More to come...</TypographyH3>
    </>
  );
}
