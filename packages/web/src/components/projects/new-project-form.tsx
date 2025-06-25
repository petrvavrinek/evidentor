"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ClientSelect from "./client-select";
import { Button } from "@/components/ui/button";

interface NewProjectFormProps {
  onSubmit: (data: { title: string; clientId: number | null }) => void;
  isSubmitting: boolean;
}

export default function NewProjectForm({ onSubmit, isSubmitting }: NewProjectFormProps) {
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, clientId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Website Redesign"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <ClientSelect value={clientId} onChange={setClientId} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
