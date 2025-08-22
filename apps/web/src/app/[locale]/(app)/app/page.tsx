"use client";

import DashboardCountCard from "@/components/dashboard/dashboard-count-card";
import HoursSummaryCard from "@/components/dashboard/hours-summary-card";
import useTitle from "@/hooks/use-title";

import { getProjectsCount, getProjectTasksCount } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function Home() {
	const t = useTranslations("app.pages.dashboard");
	useTitle(t("title"));

	const getProjectTaskCountFn = async () => {
		const c = await getProjectTasksCount();
		return c?.count ?? 0;
	};

	const getProjectCountFn = async () => {
		const c = await getProjectsCount();
		return c?.count ?? 0;
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
				<DashboardCountCard title="Project count" countFn={getProjectCountFn} />
				<DashboardCountCard
					title="Task count"
					countFn={getProjectTaskCountFn}
				/>
			</div>
			<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 md-b4">
				<HoursSummaryCard />
			</div>

			<div className="mt-5">WIP</div>
		</div>
	);
}
