import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectsOverviewErrorProps {
  error: unknown;
}

export default function ProjectsOverviewError({ error }: ProjectsOverviewErrorProps) {
  return (
    <Card className="my-8 border-red-400">
      <CardHeader>
        <CardTitle className="text-red-600">Failed to load projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-red-500">
          {typeof error === "string"
            ? error
            : error instanceof Error
            ? error.message
            : "An unknown error occurred."}
        </div>
      </CardContent>
    </Card>
  );
}
