import { ReactNode } from "react";

import { DynamicBreadcrumb } from "./dynamic-breadcrumb";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	controls?: ReactNode;
}

export default function PageHeader({
	title,
	subtitle,
	controls,
}: PageHeaderProps) {
	return (
		<div className="space-y-6">
			<DynamicBreadcrumb
				variant="card"
				size="default"
				linkVariant="ghost"
				separatorVariant="chevron"
				maxItems={5}
			/>
			<div className="mb-4 flex items-center">
				<div className="flex flex-col">
					<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
					{subtitle ? (
						<p className="text-muted-foreground">{subtitle}</p>
					) : null}
				</div>
				<div className="flex flex-row gap-2 grow items-center justify-end h-full">
					{controls}
				</div>
			</div>
		</div>
	);
}
