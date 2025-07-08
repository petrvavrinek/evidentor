import { useEffect, useState } from "react";

import { Skeleton } from "@evidentor/ui/components/ui/skeleton";

import DashboardCard from "./dashboard-card";

interface DashboardCountCardProps {
	title: string;
	countFn: () => Promise<number>;
}

export default function DashboardCountCard({
	title,
	countFn,
}: DashboardCountCardProps) {
	const [count, setCount] = useState<number | undefined>();

	useEffect(() => {
		countFn().then(setCount);
	}, [countFn]);

	return (
		<DashboardCard title={title}>
			{count !== undefined ? (
				<div>{count}</div>
			) : (
				<Skeleton className="w-full h-6" />
			)}
		</DashboardCard>
	);
}
