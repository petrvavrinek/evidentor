import type React from "react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@evidentor/ui/components/ui/card";
import { Progress } from "@evidentor/ui/components/ui/progress";

interface DashboardCardProps {
	title: string;
	subtitle?: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
	progress?: number;
}
// <Clock className="h-4 w-4 text-muted-foreground" />

/**
 * Base dashboard card
 * @param props
 * @returns Dashboard card element
 */
export default function DashboardCard({
	title,
	icon,
	children,
	progress,
}: DashboardCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				{children}
				{progress !== undefined && <Progress value={81} className="h-1 mt-2" />}
			</CardContent>
		</Card>
	);
}
