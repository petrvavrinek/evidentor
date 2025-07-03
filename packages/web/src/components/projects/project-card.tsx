import { Project } from "@/lib/api/types.gen";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{project.title || "Untitled Project"}</CardTitle>
        {project.client && (
          <CardDescription>
            Client: {project.client.companyName} ({project.client.contactName})
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Created: {project.createdAt ? new Date(project.createdAt as string).toLocaleDateString() : "-"}
        </div>
      </CardContent>
    </Card>
  );
}
