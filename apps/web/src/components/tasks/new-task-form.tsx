"use client";

import { useState } from "react";

import { Button } from "@evidentor/ui/components/ui/button";
import { Input } from "@evidentor/ui/components/ui/input";
import { Label } from "@evidentor/ui/components/ui/label";
import { Textarea } from "@evidentor/ui/components/ui/textarea";

interface NewTaskFormProps {
	onSubmit: (title: string, description: string) => void;
	isSubmitting: boolean;
}

export default function NewTaskForm({
	onSubmit,
	isSubmitting,
}: NewTaskFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(title, description);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="title">Task Title</Label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="e.g., Website Redesign"
					required
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="title">Task Description</Label>
				<Textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="..."
					required
				/>
			</div>
			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Creating..." : "Create Task"}
			</Button>
		</form>
	);
}
