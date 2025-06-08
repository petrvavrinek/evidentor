"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
} from "@/components/ui/sidebar";
import config from "@/config/app";
import { appRoutes, type RouteItem } from "@/config/app-routes";
import { Clock } from "lucide-react";

import { NavUser } from "./nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { TypographyH1 } from "./ui/typography";
import { authClient } from "@/lib/auth-client";

interface SidebarItemProps {
  item: RouteItem;
  onClick: () => void;
  isActive: (item: RouteItem) => boolean;
}

function SidebarItem(props: SidebarItemProps) {
  const { item } = props;

  if ("href" in item) {
    return (
      <Link href={item.href} key={item.id}>
        <SidebarMenuButton
          isActive={props.isActive(item)}
          onClick={props.onClick}
        >
          {item.icon && <item.icon />}
          <span>{item.name}</span>
        </SidebarMenuButton>
      </Link>
    );
  }

  return (
    <SidebarMenu>
      <Collapsible defaultOpen={item.defaultOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {item.icon && <item.icon />}
              <span>{item.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((e) => (
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
  const user = session.data?.user!;

  const onItemClick = () => sidebar.setOpenMobile(false);

  const isActive = (item: RouteItem) =>
    "href" in item ? item.href === currentPathname : false;

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader>
        <TypographyH1 className="my-4 flex justify-center items-center">
          <Clock className="mr-2" size={32} />
          <span>{config.AppName}</span>
        </TypographyH1>
      </SidebarHeader>
      <SidebarSeparator className="w-auto" />
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
