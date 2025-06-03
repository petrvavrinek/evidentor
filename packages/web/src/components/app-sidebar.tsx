"use client";

import {
  Home,
  Users,
  FolderKanban,
  Clock,
  FileText,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react";

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

export function AppSidebar() {
  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home, id: "dashboard" },
    { name: "Clients", href: "/app/clients", icon: Users, id: "clients" },
    {
      name: "Projects",
      href: "/app/projects",
      icon: FolderKanban,
      id: "projects",
    },
    {
      name: "Time Tracker",
      href: "/time-tracker",
      icon: Clock,
      id: "/app/time-tracker",
    },
    { name: "Invoices", href: "/app/invoices", icon: FileText, id: "invoices" },
    { name: "Reports", href: "/app/reports", icon: BarChart3, id: "reports" },
    { name: "Calendar", href: "/app#", icon: Calendar, id: "calendar" },
    { name: "Settings", href: "/app/settings", icon: Settings, id: "settings" },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <TypographyH1 className="my-4">{config.AppName}</TypographyH1>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            {navigation.map((e) => (
              <SidebarMenuButton
                className="cursor-pointer"
                key={e.id}
                isActive={location.pathname == e.href}
              >
                <e.icon />
                <span>{e.name}</span>
              </SidebarMenuButton>
            ))}
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
