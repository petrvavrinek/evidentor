"use client";

import DashboardCountCard from "@/components/dashboard/dashboard-count-card";

import { getProjectCount, getProjectTaskCount } from "@/lib/api";

export default function Home() {
	const getProjectTaskCountFn = async () => {
		const c = await getProjectTaskCount();
		return c.data?.count ?? 0;
	};

	const getProjectCountFn = async () => {
		const c = await getProjectCount();
		return c.data?.count ?? 0;
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<DashboardCountCard title="Project count" countFn={getProjectCountFn} />
				<DashboardCountCard
					title="Task count"
					countFn={getProjectTaskCountFn}
				/>
			</div>

			<div className="mt-5">WIP</div>
		</div>
	);
}
