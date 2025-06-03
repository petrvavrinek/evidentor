"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import config from "@/config/app";

import { TypographyH1 } from "./ui/typography";
import { NavUser } from "./nav-user";
import { User } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <TypographyH1 className="mt-2">{config.AppName}</TypographyH1>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenuButton tooltip="Tooltip">
              <User />
              <span>Test user button</span>
            </SidebarMenuButton>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: "",
            email: "test@test.cz",
            name: "Test test",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
