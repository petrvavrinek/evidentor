"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  // Search parameter to preserve tab state
	searchParam?: string;
};

function Tabs({ className, searchParam, ...props }: TabsProps) {
	const searchParams = useSearchParams();
	const [value, setValue] = useState(props.value);

	useEffect(() => {
		if (!searchParam) return;

		const newValue = searchParams.get(searchParam);
		if (newValue) setValue(newValue);
	}, [searchParam, searchParams]);

	useEffect(() => {
		if (!value || !searchParam) return;

		const newSearchParams = Object.fromEntries(searchParams.entries());
		newSearchParams[searchParam] = value;
		const param = new URLSearchParams(newSearchParams);
		var newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${param}`;
		window.history.pushState({ path: newurl }, "", newurl);
	}, [value, searchParam, searchParams]);

	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn("flex flex-col gap-2", className)}
			{...props}
			value={value}
			onValueChange={setValue}
		/>
	);
}

function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
				className,
			)}
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"data-[state=active]:bg-background cursor-pointer dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
