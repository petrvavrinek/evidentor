"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@evidentor/ui/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarSeparator,
	useSidebar,
} from "@evidentor/ui/components/ui/sidebar";
import { TypographyH1 } from "@evidentor/ui/components/ui/typography";

import config from "@/config/app";
import {
	appRoutes,
	type RouteItem,
} from "@/config/app-routes";
import { authClient } from "@/lib/auth-client";

import { NavUser } from "./nav-user";
import { useTranslations } from "next-intl";

interface SidebarItemProps {
	item: RouteItem;
	onClick: () => void;
	isActive: (item: RouteItem) => boolean;
}

function SidebarItem(props: SidebarItemProps) {
	const t = useTranslations("app.sidebar");

	const { item } = props;

	// Skip rendering hidden items
	if (item.hidden) {
		return null;
	}

	if ("href" in item) {
		return (
			<Link href={item.href} key={item.id}>
				<SidebarMenuButton
					isActive={props.isActive(item)}
					onClick={props.onClick}
				>
					{item.icon && <item.icon />}
					<span>{t(item.id)}</span>
				</SidebarMenuButton>
			</Link>
		);
	}

	// If all child items are hidden, don't render this parent item
	if ("items" in item && item.items.every((child) => child.hidden)) {
		return null;
	}

	return (
		<SidebarMenu>
			<Collapsible defaultOpen={item.defaultOpen} className="group/collapsible">
				<SidebarMenuItem>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton>
							{item.icon && <item.icon />}
							<span>{t(item.id)}</span>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.items
								.filter((child) => !child.hidden) // Filter out hidden items
								.map((e) => (
									<SidebarItem
										item={e}
										isActive={props.isActive}
										onClick={props.onClick}
										key={e.id}
									/>
								))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	);
}

export function AppSidebar() {
	const currentPathname = usePathname();
	const sidebar = useSidebar();
	const session = authClient.useSession();
	const user = session.data?.user;
	const onItemClick = () => sidebar.setOpenMobile(false);

	const isActive = (item: RouteItem) =>
		"href" in item ? item.href === currentPathname : false;

	if (!user) return <></>;

	return (
		<Sidebar variant="sidebar">
			<SidebarHeader>
				<TypographyH1 className="my-4 flex justify-center items-center">
					<Clock className="mr-2" size={32} />
					<span>{config.AppName}</span>
				</TypographyH1>
			</SidebarHeader>
			<div className="px-2">
				<SidebarSeparator className="w-auto m-0" />
			</div>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-col gap-2">
						{appRoutes.map((e) => (
							<SidebarItem
								isActive={isActive}
								item={e}
								onClick={onItemClick}
								key={e.id}
							/>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						avatar: user.image,
						email: user.email,
						name: user.name,
					}}
					onSignout={() => authClient.signOut()}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
