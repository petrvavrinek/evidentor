import { useEffect, useState } from "react";
import DashboardCard from "./dashboard-card";
import { Skeleton } from "../ui/skeleton";

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
